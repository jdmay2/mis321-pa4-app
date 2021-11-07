using api.Interfaces;
using MySql.Data.MySqlClient;

namespace api.Model
{
    public class EditUser : IEditUser
    {
        public void Edit(User u)
        {
            ConnectionString connection = new ConnectionString();
            string cs = connection.cs;
            using var con = new MySqlConnection(cs);
            con.Open();

            string stm = $@"UPDATE users SET userId=@id, username=@user, password=@pass, email=@email, dead=@dead WHERE userId=@id";
            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@id", u.Id);
            cmd.Parameters.AddWithValue("@user", u.Username);
            cmd.Parameters.AddWithValue("@pass", u.Password);
            cmd.Parameters.AddWithValue("@email", u.Email);
            cmd.Parameters.AddWithValue("@dead", u.Dead);

            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}