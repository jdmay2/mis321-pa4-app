using api.Interfaces;
using MySql.Data.MySqlClient;

namespace api.Model
{
    public class EditPost : IEditPost
    {
        public void Edit(Post p)
        {
            ConnectionString connection = new ConnectionString();
            string cs = connection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = $@"UPDATE posts SET userId=@userId, text=@text, date=@date, dead=@dead WHERE postId=@id";
            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@userId", p.UserId);
            cmd.Parameters.AddWithValue("@text", p.Text);
            cmd.Parameters.AddWithValue("@date", p.Date);
            cmd.Parameters.AddWithValue("@dead", p.Dead);
            cmd.Parameters.AddWithValue("@id", p.Id);

            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}