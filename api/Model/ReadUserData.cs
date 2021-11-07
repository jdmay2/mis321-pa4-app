using api.Interfaces;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

namespace api.Model
{
    public class ReadUserData : IGetAllUsers, IGetUser
    {
        public List<User> GetUsers()
        {
            ConnectionString connection = new ConnectionString();
            string cs = connection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"SELECT * FROM users WHERE dead=0";
            using var cmd = new MySqlCommand(stm, con);

            MySqlDataReader rdr = cmd.ExecuteReader();

            List<User> users = new List<User>();
            while (rdr.Read())
            {
                User u = new User()
                {
                    Id = rdr.GetInt32(0),
                    Username = rdr.GetString(1),
                    Password = rdr.GetString(2),
                    Email = rdr.GetString(3),
                    Dead = rdr.GetBoolean(4),
                };
                users.Add(u);
            }
            return users;
        }
        public User GetUser(int id)
        {
            ConnectionString connection = new ConnectionString();
            string cs = connection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"SELECT * FROM users WHERE userId=@userId AND dead=0";
            using var cmd = new MySqlCommand(stm, con);
            cmd.Parameters.AddWithValue("@userId", id);
            cmd.Prepare();
            MySqlDataReader rdr = cmd.ExecuteReader();

            rdr.Read();
            return new User()
            {
                Id = rdr.GetInt32(0),
                Username = rdr.GetString(1),
                Password = rdr.GetString(2),
                Email = rdr.GetString(3),
                Dead = rdr.GetBoolean(4),
            };
        }
    }
}