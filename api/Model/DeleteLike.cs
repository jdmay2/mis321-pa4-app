using api.Interfaces;
using MySql.Data.MySqlClient;

namespace api.Model
{
    public class DeleteLike : IDeleteLike
    {
        public void Delete(int id)
        {
            ConnectionString connection = new ConnectionString();
            string cs = connection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"DELETE FROM likes WHERE likeId=@id";
            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@id", id);

            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}