document.getElementById('accountDropdownBtn').addEventListener('mouseenter', function () {
  document.getElementById('accountDropdownMenu').classList.add('show');
});

document.getElementById('accountDropdownBtn').addEventListener('mouseleave', function () {
  document.getElementById('accountDropdownMenu').classList.remove('show');
});

document.getElementById('accountDropdownMenu').addEventListener('mouseenter', function () {
  this.classList.add('show');
});

document.getElementById('accountDropdownMenu').addEventListener('mouseleave', function () {
  this.classList.remove('show');
});

// like button ++ -- :)
document.addEventListener('DOMContentLoaded', function () {
  const likeButton = document.getElementById('likeButton');
  let likeCount = document.getElementById('likeCount');
  let isLiked = false;
  let count = parseInt(likeCount.textContent);

  likeButton.addEventListener('click', function () {
    if (!isLiked) {
      count++;
      likeCount.textContent = count.toString();
      likeButton.querySelector('i').classList.remove('fa-regular');
      likeButton.querySelector('i').classList.add('fa-solid');
    } else {
      count--;
      likeCount.textContent = count.toString();
      likeButton.querySelector('i').classList.remove('fa-solid');
      likeButton.querySelector('i').classList.add('fa-regular');
    }
    isLiked = !isLiked;
  });
});

