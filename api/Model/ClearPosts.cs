using api.Interfaces;
using MySql.Data.MySqlClient;

namespace api.Model
{
    public class ClearPosts : IClearPosts
    {
        public void Clear()
        {
            ConnectionString connection = new ConnectionString();
            string cs = connection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = @"TRUNCATE TABLE posts";
            using var cmd = new MySqlCommand(stm, con);

            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}