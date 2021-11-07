using api.Model;
using System.Collections.Generic;

namespace api.Interfaces
{
    public interface IGetAllPosts
    {
        List<Post> GetPosts();
    }
}