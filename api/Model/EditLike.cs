using api.Interfaces;
using MySql.Data.MySqlClient;

namespace api.Model
{
    public class EditLike : IEditLike
    {
        public void Edit(Like l)
        {
            ConnectionString connection = new ConnectionString();
            string cs = connection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = $@"UPDATE likes SET postId=@postId, userId=@userId WHERE likeId=@id";
            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@postId", l.PostId);
            cmd.Parameters.AddWithValue("@userId", l.UserId);
            cmd.Parameters.AddWithValue("@id", l.Id);

            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}