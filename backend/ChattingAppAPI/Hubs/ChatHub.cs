using System.Text.RegularExpressions;
using ChattingAppAPI.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChattingAppAPI.Hubs;

public class ChatHub : Hub
{
    private readonly IDictionary<string, UserRoomConnection> _connection;

    public ChatHub(IDictionary<string, UserRoomConnection> connection)
    {
        _connection = connection;
    }

    public async Task JoinRoom(UserRoomConnection userRoomConnection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userRoomConnection.RoomName!);
        _connection[Context.ConnectionId] = userRoomConnection;
        await Clients.Group(userRoomConnection.RoomName!).SendAsync("ReceiveMessage", "Admin", $"{userRoomConnection.Username} has joined the {userRoomConnection.RoomName} group", DateTime.Now);

        await SendConnectedUsers(userRoomConnection.RoomName!);
    }

    public async Task SendMessage(string message)
    {
        if (_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection? userRoomConnection))
        {
            await Clients.Group(userRoomConnection.RoomName!).SendAsync("ReceiveMessage", userRoomConnection.Username, message, DateTime.Now);
        }
    }

    public Task SendConnectedUsers(string roomName)
    {
        var users = _connection.Values.Where(x => x.RoomName == roomName).Select(x => x.Username);

        return Clients.Group(roomName).SendAsync("ConnectedUsers", users);
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        if (!_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection? userRoomConnection))
        {
            return base.OnDisconnectedAsync(exception);
        }

        _connection.Remove(Context.ConnectionId);

        Clients.Group(userRoomConnection.RoomName!).SendAsync("ReceiveMessage", "Admin", $"{userRoomConnection.Username} has left the {userRoomConnection.RoomName} group", DateTime.Now);

        SendConnectedUsers(userRoomConnection.RoomName!);

        return base.OnDisconnectedAsync(exception);
    }
}