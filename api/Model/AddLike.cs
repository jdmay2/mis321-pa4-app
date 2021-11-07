using api.Interfaces;
using MySql.Data.MySqlClient;

namespace api.Model
{
    public class AddLike : IAddLike
    {
        public void Add(Like l)
        {
            ConnectionString myConnection = new ConnectionString();
            string cs = myConnection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"INSERT INTO likes(likeId, postId, userId) VALUES(@likeId, @postId, @userId)";

            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@likeId", l.Id);
            cmd.Parameters.AddWithValue("@postId", l.PostId);
            cmd.Parameters.AddWithValue("@userId", l.UserId);

            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}