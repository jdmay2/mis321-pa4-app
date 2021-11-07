using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using api.Model;
using api.Interfaces;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        // GET: api/attendance
        [EnableCors("AnotherPolicy")]
        [HttpGet(Name = "GetPosts")]
        public List<Post> Get()
        {
            IGetAllPosts readPosts = new ReadPostData();
            return readPosts.GetPosts();
        }
        // GET: api/attendance/5
        [EnableCors("AnotherPolicy")]
        [HttpGet("{id}", Name = "GetPost")]
        public Post Get(int id)
        {
            IGetPost readPost = new ReadPostData();
            return readPost.GetPost(id);
        }

        // POST: api/attendance
        [EnableCors("AnotherPolicy")]
        [HttpPost(Name = "PostPost")]
        public void Post(Post p)
        {
            IAddPost add = new AddPost();
            add.Add(p);
        }

        // PUT: api/attendance/5
        [HttpPut("{id}")]
        public void Put(Post p)
        {
            IEditPost edit = new EditPost();
            edit.Edit(p);
        }

        // DELETE: api/attendance/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            IDeletePost delete = new DeletePost();
            delete.Delete(id);
        }
    }
}