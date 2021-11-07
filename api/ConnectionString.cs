namespace api
{
    public class ConnectionString
    {
        public string cs { get; set; }
        public ConnectionString()
        {
            string server = "g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
            string database = "n06gdg8me5vq9ygp";
            string port = "3306";
            string userName = "peevb8rnbanrtyn2";
            string password = "z5ui4y0wgjneigb0";
            cs = $@"server = {server};user={userName};database={database};port={port};password={password};";
        }
    }
}