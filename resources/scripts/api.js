const userUrl = `https://mis321-pa4-api.herokuapp.com/api/User`;
const postUrl = `https://mis321-pa4-api.herokuapp.com/api/Post`;
const chatUrl = `https://mis321-pa4-api.herokuapp.com/api/Chat`;
const messageUrl = `https://mis321-pa4-api.herokuapp.com/api/Message`;

reload = () => {
  window.location.reload();
};

/* ******* AUTOMATIC RELOAD - REMOVE IF TOO HIGH OF TRAFFIC ******* */

(async () => {
  var chats = await fetch(chatUrl).then((res) => res.json());
  var messages = await fetch(messageUrl).then((res) => res.json());
  setInterval(async () => {
    const m = await fetch(messageUrl).then((res) => res.json());
    const c = await fetch(chatUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const id = getId();
    if (m.length > messages.length) {
      if (document.URL.includes("chat.html")) {
        if (document.getElementById("secondary-id")) {
          reloadMessages();
          const us = document.getElementById("users").children;
          for (let i = 0; i < us.length; i++) {
            const uid = us[i].id;
            const uID = parseInt(uid);
            const filteredChats = c.filter(
              (chat) =>
                (chat.userOneId == id && chat.userTwoId == uID) ||
                (chat.userOneId == uID && chat.userTwoId == id)
            );
            const chatses = filteredChats.length > 0 ? filteredChats[0] : null;
            if (chatses) {
              const chatId = chatses.id;
              const oldFilteredMessages = messages.filter(
                (message) => message.chatId == chatId
              );
              const oldMessages =
                oldFilteredMessages.length > 0 ? oldFilteredMessages : null;
              const newFilteredMessages = m.filter(
                (message) => message.chatId == chatId
              );
              const newMessages =
                newFilteredMessages.length > 0 ? newFilteredMessages : null;
              if (newMessages && oldMessages) {
                if (newMessages.length > oldMessages.length) {
                  if (
                    uID !=
                    parseInt(document.getElementById("secondary-id").innerHTML)
                  ) {
                    document
                      .getElementById(`chat-badge-${uID}`)
                      .classList.remove("d-none");
                  }
                }
              }
            }
          }
        } else {
          const us = document.getElementById("users").children;
          for (let i = 0; i < us.length; i++) {
            const uid = us[i].id;
            const uID = parseInt(uid);
            const filteredChats = c.filter(
              (chat) =>
                (chat.userOneId == id && chat.userTwoId == uID) ||
                (chat.userOneId == uID && chat.userTwoId == id)
            );
            const chatses = filteredChats.length > 0 ? filteredChats[0] : null;
            if (chatses) {
              const chatId = chatses.id;
              const oldFilteredMessages = messages.filter(
                (message) => message.chatId == chatId
              );
              const oldMessages =
                oldFilteredMessages.length > 0 ? oldFilteredMessages : null;
              const newFilteredMessages = m.filter(
                (message) => message.chatId == chatId
              );
              const newMessages =
                newFilteredMessages.length > 0 ? newFilteredMessages : null;
              if (newMessages && oldMessages) {
                if (newMessages.length > oldMessages.length) {
                  document
                    .getElementById(`chat-badge-${uID}`)
                    .classList.remove("d-none");
                }
              }
            }
          }
        }
      } else {
        const filterChats = c.filter(
          (chat) => chat.userOneId == id || chat.userTwoId == id
        );
        const chatses = filterChats.length > 0 ? filterChats : null;
        if (chatses) {
          chatses.forEach((chat) => {
            const chatId = chat.id;
            const oldFilteredMessages = messages.filter(
              (message) => message.chatId == chatId
            );
            const oldMessages =
              oldFilteredMessages.length > 0 ? oldFilteredMessages : null;
            const newFilteredMessages = m.filter(
              (message) => message.chatId == chatId
            );
            const newMessages =
              newFilteredMessages.length > 0 ? newFilteredMessages : null;
            if (newMessages && oldMessages) {
              if (newMessages.length > oldMessages.length) {
                const userTwo = newMessages[newMessages.length - 1].userId;
                const filteredUsers = users.filter(
                  (user) => user.id == userTwo
                );
                const userTwoName = filteredUsers[0].username;
                document.getElementById("chat-badge").style.display = "flex";
                if (document.getElementById("chat-badge-name")) {
                  document.getElementById(`chat-badge-name`).remove();
                  const name = document.createElement("div");
                  name.id = "chat-badge-name";
                  name.innerHTML = userTwoName;
                  document.getElementById("chat-badge").prepend(name);
                } else {
                  const name = document.createElement("div");
                  name.id = "chat-badge-name";
                  name.innerHTML = userTwoName;
                  document.getElementById("chat-badge").prepend(name);
                }
              }
            }
          });
        }
      }
    }
    chats = c;
    messages = m;
  }, 15000);
})();

/* ******* AUTOMATIC RELOAD - REMOVE IF TOO HIGH OF TRAFFIC ******* */

refresh = () => {
  if (document.URL.includes("home.html")) {
    populatePostList();
  } else if (document.URL.includes("profile.html")) {
    populateProfileList();
  } else if (document.URL.includes("user.html")) {
    populateUserList();
  }
};

getId = () => {
  const uid =
    sessionStorage.getItem("jokkouid") !== null
      ? sessionStorage.getItem("jokkouid")
      : localStorage.getItem("jokkouid");
  return parseInt(uid);
};

dateFormat = (date) => {
  var date = new Date(date);
  var hh = date.getHours() - 6;
  if (hh < 0) {
    hh = 24 + hh;
  }
  var min = date.getMinutes();
  var ampm = hh >= 12 ? "pm" : "am";
  hh = hh % 12;
  hh = hh ? hh : 12;
  min = min < 10 ? "0" + min : min;
  var strTime = hh + ":" + min + " " + ampm;
  date =
    date.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " " +
    strTime;
  return date;
};

deleteAccount = async () => {
  const uid = getId();
  try {
    fetch(`${userUrl}/${uid}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.text())
      .then(() => {
        if (localStorage.getItem("jokkouid") !== null) {
          localStorage.removeItem("jokkouid");
        } else {
          sessionStorage.removeItem("jokkouid");
        }
      })
      .then(() => reload());
  } catch (error) {
    console.log(error);
  }
};

handleDeletePost = async (id) => {
  try {
    fetch(`${postUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.text())
      .then(() => {
        document.getElementById(`post-${id}`).remove();
      });
  } catch (error) {
    console.log(error);
  }
};

handleEditPost = async (id) => {
  document.getElementById("sub-post").innerHTML = "";
  const posts = await fetch(postUrl).then((res) => res.json());
  const users = await fetch(userUrl).then((res) => res.json());
  const filteredPosts = posts.filter((post) => post.id == id);
  const p = filteredPosts[0];
  const filteredPosts2 = posts.filter((post) => post.id == p.subId);
  const sp = filteredPosts2.length > 0 ? filteredPosts2[0] : null;
  const filteredUsers2 = sp
    ? users.filter((user) => user.id == p.userId)
    : null;
  const subUser = filteredUsers2
    ? filteredUsers2.length > 0
      ? filteredUsers2[0]
      : null
    : null;
  if (sp) {
    const post = document.createElement("div");
    post.className = "col-xl-4";
    post.innerHTML = `<div id="cd" class="card text-white">
    <div class="card-header text-center">
      <p id="editPostId">${p.id}</p>
      <a id="user-tag" onclick="navUser(${sp.userId})">${subUser.username}</a>
    </div>
    <div class="card-body">
      <div class="card-text">${sp.text}</div>
    </div>
    <div class="card-footer text-center">
      ${dateFormat(sp.date)}
    </div>
  </div>`;
    document.getElementById("edit-sub-post").appendChild(post);
    document.getElementById("editInput").value = p.text;
  } else {
    document.getElementById(
      "edit-sub-post"
    ).innerHTML = `<p id="editPostId">${p.id}</p>`;
    document.getElementById("editInput").value = p.text;
  }
};

postItem = ({ p, posts, users, likes, uid }) => {
  const filteredPosts = posts.filter((post) => post.id == p.subId);
  const subPost = filteredPosts[0];
  const filteredUsers = users.filter((user) => user.id == p.userId);
  const filteredUsers2 =
    subPost !== undefined
      ? users.filter((user) => user.id == subPost.userId)
      : [];
  const subUser = filteredUsers2[0];
  const username = filteredUsers[0].username;
  const likesByPost = likes.filter((like) => like.postId == p.id);
  const postLikes = likesByPost.length > 0 ? likesByPost.length : 0;
  const postBySub = posts.filter((post) => post.subId == p.id);
  const reposts = postBySub.length > 0 ? postBySub.length : 0;
  const post = document.createElement("div");
  post.id = `post-${p.id}`;
  post.className = "col-xl-4 animate__animated animate__zoomIn";
  post.innerHTML = `<div id="cd" class="card text-white">
          <div class="card-header text-center">
            <a id="user-tag" onclick="navUser(${p.userId})">${username}</a>
          </div>
          ${
            p.subId == 0
              ? ""
              : `<div id="sub-post-body" class="col-xl-4">
              <div id="sub-cd" class="card text-white">
              <div class="card-header text-center">
                <a id="user-tag" onclick="navUser(${subPost.userId})">${
                  subUser.username
                }</a>
              </div>
              <div class="card-body">
                <div class="card-text">${subPost.text}</div>
              </div>
              <div class="card-footer text-center">
                ${dateFormat(subPost.date)}
              </div>
            </div>
              </div>`
          }
          <div class="card-body">
              <div class="card-text">${p.text}</div>
              <div id="rating">
                ${
                  p.userId == uid
                    ? `<i id="like-${p.id}" class="bi bi-trash-fill" onclick="handleDeletePost(${p.id})"></i>
                      <i class="bi bi-pencil-square" data-bs-toggle="modal"
                      data-bs-target="#editModal" onclick="handleEditPost(${p.id})"></i>`
                    : `<i id="like-${p.id}" class="bi ${
                        likes.filter(
                          (like) => like.postId == p.id && like.userId == uid
                        ).length > 0
                          ? "bi-heart-fill"
                          : "bi-heart"
                      }" onclick="like(${p.id})"></i>
                      <i class="bi bi-arrow-repeat" data-bs-toggle="modal"
                      data-bs-target="#repostModal" onclick="repost(${
                        p.id
                      })"></i>`
                }
            </div>
          </div>
          <div id="post-footer" class="card-footer">
            <div id="date-column" class="col align-center">
              ${dateFormat(p.date)}
            </div>
            <div id="post-analytics-col" class="col">
              <div id="like-count">${postLikes}<i class="bi bi-heart-fill"></i>
              </div>
              <div id="repost-count">${reposts}<i class="bi bi-arrow-repeat"></i>
              </div>
            </div>
          </div>
        </div>`;
  return post;
};

repost = async (id) => {
  document.getElementById("sub-post").innerHTML = "";
  const posts = await fetch(postUrl).then((res) => res.json());
  const users = await fetch(userUrl).then((res) => res.json());
  const filteredPosts = posts.filter((post) => post.id == id);
  const p = filteredPosts[0];
  const filteredUsers = users.filter((user) => user.id == p.userId);
  const subUser = filteredUsers[0];
  const post = document.createElement("div");
  post.className = "row-xl-4";
  post.innerHTML = `<div id="cd" class="card text-white">
  <div class="card-header text-center">
    <p id="postId">${p.id}</p>
    <a id="user-tag" onclick="navUser(${p.userId})">${subUser.username}</a>
  </div>
  <div class="card-body">
    <div class="card-text">${p.text}</div>
  </div>
  <div class="card-footer text-center">
    ${dateFormat(p.date)}
  </div>
</div>`;
  document.getElementById("sub-post").appendChild(post);
};

findUser = async (name) => {
  const users = await fetch(userUrl).then((res) => res.json());
  const filteredUsers = users.filter((user) => user.username == name);
  return filteredUsers[0].id;
};

handleOnSubmit = async () => {
  const users = await fetch(userUrl).then((res) => res.json());
  const email = document.getElementById("userEmail").value.toLowerCase();
  const username = document.getElementById("userName").value.toLowerCase();
  const password = document.getElementById("userPassword").value;
  if (email.length > 0 && username.length > 0 && password.length > 0) {
    if (email.includes("@") && email.includes(".")) {
      var u = false;
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
          u = true;
          break;
        }
      }
      if (!u) {
        fetch(userUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            username: username,
            password: password,
          }),
        })
          .then((res) => res.text())
          .then(() => findUser(username))
          .then((i) => {
            sessionStorage.setItem("jokkouid", i);
          })
          .then(() => reload());
      } else {
        alert("Username already exists");
      }
    } else {
      alert("Invalid email");
    }
  } else {
    alert("One or more fields do not contain a value!");
  }
};

handleOnLogin = async () => {
  const users = await fetch(userUrl).then((res) => res.json());
  const username = document.getElementById("userName").value.toLowerCase();
  const password = document.getElementById("userPassword").value;
  const check = document.getElementById("check").checked;
  try {
    if (username !== null && password !== null) {
      var u = false;
      var id = null;
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
          if (users[i].password == password) {
            u = true;
            id = users[i].id;
            break;
          }
        }
      }
      if (u) {
        if (
          localStorage.getItem("jokkouid") !== null ||
          sessionStorage.getItem("jokkouid") !== null
        ) {
          localStorage.removeItem("jokkouid");
          sessionStorage.removeItem("jokkouid");
        }
        if (check) {
          localStorage.setItem("jokkouid", id);
        } else {
          sessionStorage.setItem("jokkouid", id);
        }
        window.location.replace(`/home.html`);
      } else {
        alert("Invalid username or password");
      }
    } else {
      alert("Please enter a username and password!");
    }
  } catch (error) {
    console.log(error);
  }
};

getPost = async ({ uid }) => {
  const posts = await fetch(postUrl).then((res) => res.json());
  const filteredPosts = posts.filter((post) => post.userId == uid);
  const p = filteredPosts[filteredPosts.length - 1];
  return p;
};

getPostById = async ({ id }) => {
  const posts = await fetch(postUrl).then((res) => res.json());
  const filteredPosts = posts.filter((post) => post.id == id);
  const p = filteredPosts[0];
  return p;
};

handleOnPost = async () => {
  const uid = getId();
  const users = await fetch(userUrl).then((res) => res.json());
  const posts = await fetch(postUrl).then((res) => res.json());
  const likes = await fetch(likeUrl).then((res) => res.json());
  const text = document.getElementById("postInput").value;
  const date = new Date().toISOString();
  try {
    if (text.length > 0) {
      fetch(postUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: uid,
          text: text,
          date: date,
        }),
      })
        .then((res) => res.text())
        .then(() => {
          return getPost({ uid });
        })
        .then((p) => {
          document.getElementById("postInput").value = "";
          document
            .getElementById("posts")
            .prepend(postItem({ p: p, posts, users, likes, uid }));
        });
    } else {
      alert("You have not typed anything!");
    }
  } catch (error) {
    console.log(error);
  }
};

handleRepost = async () => {
  const uid = getId();
  const pid = parseInt(document.getElementById("postId").innerText);
  const posts = await fetch(postUrl).then((res) => res.json());
  const likes = await fetch(likeUrl).then((res) => res.json());
  const users = await fetch(userUrl).then((res) => res.json());
  const text = document.getElementById("repostInput").value;
  const date = new Date().toISOString();
  try {
    if (text.length > 0) {
      fetch(postUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: uid,
          subId: pid,
          text: text,
          date: date,
        }),
      })
        .then((res) => res.text())
        .then(() => {
          return getPost({ uid });
        })
        .then((p) => {
          document.getElementById("postInput").value = "";
          document
            .getElementById("posts")
            .prepend(postItem({ p: p, posts, users, likes, uid }));
        });
    } else {
      alert("You have not typed anything!");
    }
  } catch (error) {
    console.log(error);
  }
};

handleOnEdit = async () => {
  const pid = parseInt(document.getElementById("editPostId").innerText);
  const text = document.getElementById("editInput").value;
  const uid = getId();
  const posts = await fetch(postUrl).then((res) => res.json());
  const likes = await fetch(likeUrl).then((res) => res.json());
  const users = await fetch(userUrl).then((res) => res.json());
  try {
    if (text.length > 0) {
      fetch(postUrl, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: pid,
          text: text,
        }),
      })
        .then(() => {
          return getPostById({ id: pid });
        })
        .then((p) => {
          document.getElementById("editInput").value = "";
          document
            .getElementById(`post-${pid}`)
            .replaceWith(postItem({ p: p, posts, users, likes, uid }));
        });
    } else {
      alert("You have not typed anything!");
    }
  } catch (error) {
    console.log(error);
  }
};

populatePostList = async () => {
  try {
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(likeUrl).then((res) => res.json());
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    document.getElementById("posts").innerHTML = "";
    document.getElementById("sub-spinner").style.display = "none";
    document.getElementById("spinner").style.display = "none";
    if (posts.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        setTimeout(() => {
          document
            .getElementById("posts")
            .appendChild(postItem({ p: posts[i], posts, users, likes, uid }));
        }, i * 100);
      }
    } else {
      const post = document.createElement("div");
      post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
      post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
      document.getElementById("posts").appendChild(post);
    }
  } catch (error) {
    console.error(error);
  }
};

populateProfileList = async () => {
  document.getElementById("profile-likes").className = "nav-link";
  document.getElementById("profile-your").className = "nav-link active";
  try {
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(likeUrl).then((res) => res.json());
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const filteredPosts = posts.filter((post) => post.userId == uid);
    document.getElementById("posts").innerHTML = "";
    document.getElementById("sub-spinner").style.display = "none";
    document.getElementById("spinner").style.display = "none";
    if (filteredPosts.length > 0) {
      for (let i = 0; i < filteredPosts.length; i++) {
        document
          .getElementById("posts")
          .appendChild(
            postItem({ p: filteredPosts[i], posts, users, likes, uid })
          );
      }
    } else {
      const post = document.createElement("div");
      post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
      post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
      document.getElementById("posts").appendChild(post);
    }
  } catch (error) {
    console.error(error);
  }
};

populateLikes = async () => {
  document.getElementById("profile-your").className = "nav-link";
  document.getElementById("profile-likes").className = "nav-link active";
  try {
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(likeUrl).then((res) => res.json());
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const filteredLikes = likes.filter((like) => like.userId == uid);
    const likePostIds = filteredLikes.map((like) => like.postId);
    const filteredPosts = posts.filter((post) => likePostIds.includes(post.id));
    document.getElementById("posts").innerHTML = "";
    document.getElementById("sub-spinner").style.display = "none";
    document.getElementById("spinner").style.display = "none";
    if (filteredPosts.length > 0) {
      for (let i = 0; i < filteredPosts.length; i++) {
        document
          .getElementById("posts")
          .appendChild(
            postItem({ p: filteredPosts[i], posts, users, likes, uid })
          );
      }
    } else {
      const post = document.createElement("div");
      post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
      post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
      document.getElementById("posts").appendChild(post);
    }
  } catch (error) {
    console.error(error);
  }
};

populateUserList = async () => {
  document.getElementById("profile-likes").className = "nav-link";
  document.getElementById("profile-your").className = "nav-link active";
  try {
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(likeUrl).then((res) => res.json());
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const uID = parseInt(params.jokkouid);
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    if (uID !== null) {
      const filteredPosts = posts.filter((post) => post.userId === uID);
      document.getElementById("posts").innerHTML = "";
      document.getElementById("sub-spinner").style.display = "none";
      document.getElementById("spinner").style.display = "none";
      if (filteredPosts.length > 0) {
        for (let i = 0; i < filteredPosts.length; i++) {
          document
            .getElementById("posts")
            .appendChild(
              postItem({ p: filteredPosts[i], posts, users, likes, uid })
            );
        }
      } else {
        const post = document.createElement("div");
        post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
        post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
        document.getElementById("posts").appendChild(post);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

populateUserLikes = async () => {
  document.getElementById("profile-your").className = "nav-link";
  document.getElementById("profile-likes").className = "nav-link active";
  try {
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(likeUrl).then((res) => res.json());
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const uID = parseInt(params.jokkouid);
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    if (uID !== null) {
      const filteredLikes = likes.filter((like) => like.userId === uID);
      const likePostIds = filteredLikes.map((like) => like.postId);
      const filteredPosts = posts.filter((post) =>
        likePostIds.includes(post.id)
      );
      document.getElementById("posts").innerHTML = "";
      document.getElementById("sub-spinner").style.display = "none";
      document.getElementById("spinner").style.display = "none";
      if (filteredPosts.length > 0) {
        for (let i = 0; i < filteredPosts.length; i++) {
          document
            .getElementById("posts")
            .appendChild(
              postItem({ p: filteredPosts[i], posts, users, likes, uid })
            );
        }
      } else {
        const post = document.createElement("div");
        post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
        post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
        document.getElementById("posts").appendChild(post);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

handleOnSearch = async () => {
  try {
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(likeUrl).then((res) => res.json());
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const searchBar = document.getElementById("searchbar");
    searchBar.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        var search = searchBar.value.toLowerCase();
        const filteredPosts = [];
        for (let i = 0; i < posts.length; i++) {
          const filteredUsers = users.filter(
            (user) => user.id == posts[i].userId
          );
          const username = filteredUsers[0].username;
          if (
            posts[i].text.toLowerCase().includes(search) ||
            username.toLowerCase().includes(search)
          ) {
            filteredPosts.push(posts[i]);
          }
        }
        document.getElementById("posts").innerHTML = "";
        document.getElementById("sub-spinner").style.display = "none";
        document.getElementById("spinner").style.display = "none";
        if (filteredPosts.length > 0) {
          filteredPosts.forEach((p) => {
            document
              .getElementById("posts")
              .appendChild(postItem({ p: p, posts, users, likes, uid }));
          });
        } else {
          const post = document.createElement("div");
          post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
          post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              No results found
            </div>
          </div>`;
          document.getElementById("posts").appendChild(post);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

onIndexLoad = () => {
  if (
    localStorage.getItem("jokkouid") !== null ||
    sessionStorage.getItem("jokkouid") !== null
  ) {
    window.location.replace(`/home.html`);
  }
};

onHomeLoad = () => {
  if (
    localStorage.getItem("jokkouid") === null &&
    sessionStorage.getItem("jokkouid") === null
  ) {
    window.location.replace(`/index.html`);
  } else {
    populatePostList();
  }
};

onProfileLoad = async () => {
  const users = await fetch(userUrl).then((res) => res.json());
  const uid = getId();
  if (uid !== null) {
    const filteredUsers = users.filter((user) => user.id == uid);
    if (filteredUsers.length > 0) {
      document.getElementById("searchbar").placeholder =
        filteredUsers[0].username;
      populateProfileList();
    } else {
      window.location.replace(`/index.html`);
    }
  } else {
    window.location.replace(`/index.html`);
  }
};

onUserLoad = async () => {
  if (
    localStorage.getItem("jokkouid") === null &&
    sessionStorage.getItem("jokkouid") === null
  ) {
    window.location.replace(`/index.html`);
  } else {
    const users = await fetch(userUrl).then((res) => res.json());
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const uID = params.jokkouid;
    if (uID !== null) {
      const filteredUsers = users.filter((user) => user.id == uID);
      if (filteredUsers.length > 0) {
        document.getElementById("searchbar").placeholder =
          filteredUsers[0].username;
        populateUserList();
      } else {
        window.location.replace(`/home.html`);
      }
    } else {
      window.location.replace(`/home.html`);
    }
  }
};

// Start of chat script

onChatLoad = async () => {
  const users = await fetch(userUrl).then((res) => res.json());
  const uid = getId();
  if (uid !== null) {
    const filteredUsers = users.filter((user) => user.id != uid);
    if (filteredUsers.length > 0) {
      filteredUsers.forEach((u) => {
        popUserSearch({ u: u });
      });
    }
  } else {
    window.location.replace(`/index.html`);
  }
};

popUserSearch = ({ u }) => {
  const user = document.createElement("div");
  user.id = u.id;
  user.className = "row";
  user.onclick = () => {
    loadMessages(u.id);
  };
  user.innerHTML = `<div id="user-cd-${u.id}" class="col text-white position-relative">
            <div class="text-center">${u.username}
            </div><span
            id="chat-badge-${u.id}"
            class="
              position-absolute
              top-0
              start-100
              translate-middle
              p-2
              bg-danger
              rounded-circle
              d-none
            "
          >
            <span class="visually-hidden">New alerts</span>
          </span>
          </div>`;
  document.getElementById("users").appendChild(user);
};

handleUserSearch = async () => {
  try {
    const us = await fetch(userUrl).then((res) => res.json());
    const uid = getId();
    const users = us.filter((user) => user.id != uid);
    const searchBar = document.getElementById("user-searchbar");
    searchBar.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        var search = searchBar.value.toLowerCase();
        const filteredUsers = [];
        for (let i = 0; i < users.length; i++) {
          if (users[i].username.toLowerCase().includes(search)) {
            filteredUsers.push(users[i]);
          }
        }
        document.getElementById("users").innerHTML = "";
        if (filteredUsers.length > 0) {
          filteredUsers.forEach((u) => {
            popUserSearch({ u: u });
          });
        }
      } else {
        var search = searchBar.value.toLowerCase();
        const filteredUsers = [];
        for (let i = 0; i < users.length; i++) {
          if (users[i].username.toLowerCase().includes(search)) {
            filteredUsers.push(users[i]);
          }
        }
        document.getElementById("users").innerHTML = "";
        if (filteredUsers.length > 0) {
          filteredUsers.forEach((u) => {
            popUserSearch({ u: u });
          });
        } else {
          const user = document.createElement("div");
          user.className = "row";
          user.ariaDisabled = true;
          user.innerHTML = `<div id="user-cd" class="col text-white">
            <div class="text-center"> No results found
            </div>
          </div>`;
          document.getElementById("users").appendChild(user);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

loadMessages = async (uID) => {
  document.getElementById("refresh").style.display = "flex";
  document.getElementById(`chat-badge-${uID}`).classList.add("d-none");
  try {
    const uid = getId();
    const chats = await fetch(chatUrl).then((res) => res.json());
    const messages = await fetch(messageUrl).then((res) => res.json());
    const filteredChat = chats.filter(
      (chat) =>
        (chat.userOneId == uid && chat.userTwoId == uID) ||
        (chat.userOneId == uID && chat.userTwoId == uid)
    );
    const chat = filteredChat[0] || null;
    if (document.getElementById("secondary-id")) {
      document.getElementById("secondary-id").remove();
    }
    if (document.getElementById("chat-id")) {
      document.getElementById("chat-id").remove();
    }
    const secondaryId = document.createElement("div");
    secondaryId.style.display = "none";
    secondaryId.id = "secondary-id";
    secondaryId.innerHTML = uID;
    document.getElementById("message-column").appendChild(secondaryId);
    document.getElementById("messages").innerHTML = "";
    if (chat != null) {
      const chatId = document.createElement("div");
      chatId.style.display = "none";
      chatId.id = "chat-id";
      chatId.innerHTML = chat.id;
      document.getElementById("message-column").appendChild(chatId);
      const filteredMessages = messages.filter(
        (message) => message.chatId == chat.id
      );
      document.getElementById("messages").innerHTML = "";
      if (filteredMessages.length > 0) {
        filteredMessages.forEach((m) => {
          if (m.userId == uid) {
            const message = document.createElement("div");
            message.className = "col-6 align-self-end";
            message.innerHTML = `<div class="col-xl-12 w-100">
                <div class="text-white">
                  <div class="text-center">
                    ${m.text}
                  </div>
                </div>
                <div class="date me-2">${dateFormat(m.date)}</div>
              </div>`;
            document.getElementById("messages").appendChild(message);
            document.getElementById("messages").scrollTop =
              document.getElementById("messages").scrollHeight;
          } else {
            const message = document.createElement("div");
            message.className = "col-6 align-self-start";
            message.innerHTML = `<div class="col-xl-12 w-100">
                <div id="secondary" class="text-white">
                  <div class="text-center">
                    ${m.text}
                  </div>
                </div>
                <div class="date me-2">${dateFormat(m.date)}</div>
              </div>`;
            document.getElementById("messages").appendChild(message);
            document.getElementById("messages").scrollTop =
              document.getElementById("messages").scrollHeight;
          }
        });
      } else {
        document.getElementById("messages").innerHTML = "";
        const message = document.createElement("div");
        message.className = "col-xl-4 w-100";
        message.innerHTML = `<div id="cd" class="card text-white">
              <div class="card-header text-center">
                No messages found, start a conversation
              </div>
            </div>`;
        document.getElementById("messages").appendChild(message);
      }
    } else {
      document.getElementById("messages").innerHTML = "";
      const message = document.createElement("div");
      message.className = "col-xl-4 w-100";
      message.innerHTML = `<div id="cd" class="card text-white">
              <div class="card-header text-center">
                Send a message to start a chat
              </div>
            </div>`;
      document.getElementById("messages").appendChild(message);
      fetch(chatUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userOneId: uid,
          userTwoId: uID,
        }),
      })
        .then((res) => res.text())
        .then(() => reloadMessages());
    }
  } catch (error) {
    console.error(error);
  }
};

reloadMessages = () => {
  loadMessages(parseInt(document.getElementById("secondary-id").innerHTML));
};

sendMessage = async () => {
  var inputBox = document.getElementById("message-input-box");
  var ms = document.getElementById("messages");
  if (inputBox.value != "") {
    if (document.getElementById("secondary-id")) {
      try {
        const uid = getId();
        const chatId = document.getElementById("chat-id")
          ? parseInt(document.getElementById("chat-id").innerHTML)
          : null;
        if (chatId) {
          const message = document.createElement("div");
          message.className = "col-6 align-self-end";
          message.innerHTML = `<div class="col-xl-12 w-100">
          <div class="text-white">
            <div class="text-center">
              ${inputBox.value}
            </div>
          </div>
          <div class="date me-2">${dateFormat(new Date().toISOString())}</div>
        </div>`;
          ms.appendChild(message);
          ms.scrollTop = ms.scrollHeight;
          const messageToSend = {
            chatId: chatId,
            userId: uid,
            date: new Date().toISOString(),
            text: inputBox.value,
          };
          inputBox.value = "";
          postMessage(messageToSend);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};

postMessage = async (message) => {
  try {
    await fetch(messageUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((res) => res.text())
      .then(() => reloadMessages());
  } catch (error) {
    console.error(error);
  }
};

//end of chat script
