using api.Interfaces;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

namespace api.Model
{
    public class ReadLikeData : IGetAllLikes, IGetLike
    {
        public List<Like> GetLikes()
        {
            ConnectionString connection = new ConnectionString();
            string cs = connection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"SELECT * FROM likes";
            using var cmd = new MySqlCommand(stm, con);

            MySqlDataReader rdr = cmd.ExecuteReader();

            List<Like> likes = new List<Like>();
            while (rdr.Read())
            {
                Like l = new Like()
                {
                    Id = rdr.GetInt32(0),
                    PostId = rdr.GetInt32(1),
                    UserId = rdr.GetInt32(2),
                };
                likes.Add(l);
            }
            return likes;
        }
        public Like GetLike(int id)
        {
            ConnectionString connection = new ConnectionString();
            string cs = connection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"SELECT * FROM likes WHERE likeId=@likeId";
            using var cmd = new MySqlCommand(stm, con);
            cmd.Parameters.AddWithValue("@likeId", id);
            cmd.Prepare();
            MySqlDataReader rdr = cmd.ExecuteReader();

            rdr.Read();
            return new Like()
            {
                Id = rdr.GetInt32(0),
                PostId = rdr.GetInt32(1),
                UserId = rdr.GetInt32(2),
            };
        }
    }
}