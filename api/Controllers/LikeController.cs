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
    public class LikeController : ControllerBase
    {
        // GET: api/attendance
        [EnableCors("AnotherPolicy")]
        [HttpGet(Name = "GetLikes")]
        public List<Like> Get()
        {
            IGetAllLikes readLikes = new ReadLikeData();
            return readLikes.GetLikes();
        }
        // GET: api/attendance/5
        [EnableCors("AnotherPolicy")]
        [HttpGet("{id}", Name = "GetLike")]
        public Like Get(int id)
        {
            IGetLike readLike = new ReadLikeData();
            return readLike.GetLike(id);
        }

        // POST: api/attendance
        [EnableCors("AnotherPolicy")]
        [HttpPost(Name = "PostLike")]
        public void Post(Like l)
        {
            IAddLike add = new AddLike();
            add.Add(l);
        }

        // PUT: api/attendance/5
        [HttpPut("{id}")]
        public void Put(Like l)
        {
            IEditLike edit = new EditLike();
            edit.Edit(l);
        }

        // DELETE: api/attendance/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            IDeleteLike delete = new DeleteLike();
            delete.Delete(id);
        }
    }
}