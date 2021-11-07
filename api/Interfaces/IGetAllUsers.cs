using api.Model;
using System.Collections.Generic;

namespace api.Interfaces
{
    public interface IGetAllUsers
    {
        List<User> GetUsers();
    }
}