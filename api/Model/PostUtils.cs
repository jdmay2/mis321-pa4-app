using System;
using System.Collections.Generic;

namespace api.Model
{
    public class PostUtils
    {
        public static void DateSort(List<Post> posts)
        {
            posts.Sort((a, b) => b.Date.CompareTo(a.Date));
        }
    }
}