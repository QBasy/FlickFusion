document.addEventListener('DOMContentLoaded', function () {
  const commentBtn = document.getElementById('commentSend');
  const commentInput = document.getElementById('commentInput');
  const commentsContainer = document.getElementById('commentsContainer');
  const clearBtn = document.getElementById('commentClear');
  const authorName = "Storm"; // eto i
  const avatarUrl = "./img/toji.png"; // eto hz kak eto v bazu herachit'

  commentBtn.addEventListener('click', function () {
    const commentText = commentInput.value.trim();

    if (commentText !== '') {
      const currentDate = new Date().toLocaleString();

      const commentRow = document.createElement('div');
      commentRow.classList.add('row', 'comment', 'mb-3', 'p-3', 'border', 'rounded');

      const avatarColumn = document.createElement('div');
      avatarColumn.classList.add('col-auto', 'mr-3');

      const avatar = document.createElement('img');
      avatar.src = avatarUrl;
      avatar.alt = 'Avatar';
      avatar.classList.add('rounded-circle', 'avatar');
      avatarColumn.appendChild(avatar);

      // column for author name, date and comment
      const contentColumn = document.createElement('div');
      contentColumn.classList.add('col');

      // author name
      const commentAuthorName = document.createElement('div');
      commentAuthorName.textContent = authorName;
      commentAuthorName.classList.add('author-name', 'font-weight-bold', 'mb-1');

      // date element
      const date = document.createElement('div');
      date.textContent = currentDate;
      date.classList.add('date', 'text-muted', 'small', 'mb-1');

      // comment text
      const commentTextElement = document.createElement('div');
      commentTextElement.textContent = commentText;
      commentTextElement.classList.add('comment-text');

      // add elements inside the content column
      contentColumn.appendChild(commentAuthorName);
      contentColumn.appendChild(date);
      contentColumn.appendChild(commentTextElement);

      // add columns into row
      commentRow.appendChild(avatarColumn);
      commentRow.appendChild(contentColumn);

      // add comment row to comment's container
      commentsContainer.appendChild(commentRow);

      // clear the comment input after commenting
      commentInput.value = '';
    }
  });

  // clear button
  clearBtn.addEventListener('click', function () {
    commentInput.value = '';
  });
});

function addComment(comment, video) {
  const response = fetch(`/comment`, {
    method: 'POST',
        headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ comment, video })
  });
  if (response.success) {

  }
}