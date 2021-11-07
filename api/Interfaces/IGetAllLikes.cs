using api.Model;
using System.Collections.Generic;

namespace api.Interfaces
{
    public interface IGetAllLikes
    {
        List<Like> GetLikes();
    }
}