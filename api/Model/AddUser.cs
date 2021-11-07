using api.Interfaces;
using MySql.Data.MySqlClient;

namespace api.Model
{
    public class AddUser : IAddUser
    {
        public void Add(User u)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"INSERT INTO users(userId, username, password, email, dead) VALUES(@userId, @username, @password, @email, @dead)";

            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@userId", u.Id);
            cmd.Parameters.AddWithValue("@username", u.Username);
            cmd.Parameters.AddWithValue("@password", u.Password);
            cmd.Parameters.AddWithValue("@email", u.Email);
            cmd.Parameters.AddWithValue("@dead", u.Dead);

            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}