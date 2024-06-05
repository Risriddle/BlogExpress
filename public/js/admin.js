// admin.js

// Function to redirect to the create blog page
function redirectToCreateBlog() {
    window.location.href = '/create';
}
  

function selectBlog() {
    // Make an AJAX request to fetch the list of blogs from your API
    // Replace this with your actual API endpoint
    fetch('/blogs')
    .then(response => response.json())
    .then(data => {
        // Iterate through the list of blogs and display each one
        const blogList = document.getElementById('blogList');
        blogList.innerHTML = ''; // Clear existing list

        data.blogs.forEach(blog => {
            // Create a list item for each blog
            const listItem = document.createElement('li');
            listItem.textContent = blog.title;

            // // Create a delete button for each blog
            const updateButton = document.createElement('button');
             updateButton.textContent = '✔️'; // Displaying a cross symbol for delete
            updateButton.onclick = function() {
                // Call a function to handle the delete action
                callBlog(blog._id); // Assuming _id is the unique identifier
            };

            // Append the delete button to the list item
            listItem.appendChild(updateButton);

            // Append the list item to the blog list
            blogList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching blogs:', error));
}


// Function to handle delete action
function callBlog(blogId) {
    fetch(`/blog/${blogId}`, {
     method: 'GET'
 })
 .then(response => response.json())
 .then(data=>{
    
  console.log("blog fetched")
  console.log(data)
  console.log(data.blogs)
  const blogContainer = document.getElementById('blogUpdate');
  
const blog = data.blogs;
            // Create HTML elements
            const blogElement = document.createElement('div');
            blogElement.innerHTML = `<h2>Title:<input type="text" id="title" value="${blog.title}"></h2>
                                     <p><strong>Author:</strong> <input type="text" id="author" value="${blog.author}"></p>
                                     <p><strong>Date:</strong> <input type="date" id="date" value="${blog.date}"</p>
                                     <p><strong>Content:</strong><br><textarea id="body">${blog.body}</textarea></p>   <button id="saveButton">Save</button>`;
            // Append the blog element to the container
            blogContainer.appendChild(blogElement);


            const saveButton = document.getElementById('saveButton');
            saveButton.addEventListener('click', async () => {
                // Get the updated values
                const updatedTitle = document.getElementById('title').value;
                const updatedAuthor = document.getElementById('author').value;
                const updatedBody = document.getElementById('body').value;
                const updatedDate = document.getElementById('date').value;

                // Update the blog object
                const updatedBlog = {
                    _id: blog._id,
                    title: updatedTitle,
                    author: updatedAuthor,
                    body: updatedBody,
                    date:updatedDate
                };

                try {
                    // Send the updated blog to the server
                    const response = await fetch(`/update/${blog._id}`, {
                        method: 'PUT',  // Use 'POST' if your server uses POST for updates
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedBlog)
                    });

                    if (response.ok) {
                        const jsonResponse = await response.json();
                        const displayDiv=document.getElementById('display')
                        const disp=document.createElement('h2')
                        disp.innerHTML="Blog updated successfully"
                        displayDiv.appendChild(disp)
                        const backLink = document.createElement('a');
backLink.textContent = "Go back to blogs";
backLink.href = "/blogsUser"; // Replace "/blogs" with the actual URL of your blogs page
displayDiv.appendChild(backLink);

                        console.log('Blog updated successfully:', jsonResponse);
                    } else {
                        console.error('Failed to update blog:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        }
    )}
// Function to redirect to the update blog page
function redirectToUpdateBlog() {
    selectBlog()
}



function displayBlogs() {
    // Make an AJAX request to fetch the list of blogs from your API
    // Replace this with your actual API endpoint
    fetch('/blogs')
    .then(response => response.json())
    .then(data => {
        // Iterate through the list of blogs and display each one
        const blogList = document.getElementById('blogList');
        blogList.innerHTML = ''; // Clear existing list

        data.blogs.forEach(blog => {
            // Create a list item for each blog
            const listItem = document.createElement('li');
            listItem.textContent = blog.title;

            // Create a delete button for each blog
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌'; // Displaying a cross symbol for delete
            deleteButton.onclick = function() {
                // Call a function to handle the delete action
                deleteBlog(blog._id); // Assuming _id is the unique identifier
            };

            // Append the delete button to the list item
            listItem.appendChild(deleteButton);

            // Append the list item to the blog list
            blogList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching blogs:', error));
}

// Function to handle delete action
function deleteBlog(blogId) {
       fetch(`/delete/${blogId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
           
                        const displayDiv=document.getElementById('display')
                        const disp=document.createElement('h2')
                        disp.innerHTML="Blog deleted successfully"
                        displayDiv.appendChild(disp)
                        const backLink = document.createElement('a');
                        backLink.textContent = "Go back to blogs";
                        backLink.href = "/blogsUser"; 
                        displayDiv.appendChild(backLink);
     console.log("blog deleted")
            displayBlogs(); // Refresh the list of blogs
        } else {
            // Handle error response
            console.error('Error deleting blog:', response.statusText);
        }
    })
    .catch(error => console.error('Error deleting blog:', error));
}
function redirectToDeleteBlog(){// Call the displayBlogs function to initially load the list of blogs
    displayBlogs();}





// Attach event listeners to the buttons
document.addEventListener('DOMContentLoaded', function() {
    const createBlogButton = document.getElementById('createButton');
    const deleteBlogButton = document.getElementById('deleteButton');
    const updateBlogButton = document.getElementById('updateButton');

    createBlogButton.addEventListener('click', redirectToCreateBlog);
    deleteBlogButton.addEventListener('click', redirectToDeleteBlog);
    updateBlogButton.addEventListener('click', redirectToUpdateBlog);
});
