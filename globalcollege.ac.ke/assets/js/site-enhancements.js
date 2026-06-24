// Shared page enhancements for GTTC.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        var target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  var observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-animate]').forEach(function (element) {
    observer.observe(element);
  });

  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 24);
    });
  }

  var reviewForm = document.querySelector('#review-form');
  var reviewList = document.querySelector('.review-list');
  var reviewStorageKey = 'gttc-reviews';

  function createStarMarkup(starCount) {
    return Array.from({ length: 5 }, function (_, index) {
      return '<span class="review-star">' + (index < starCount ? '★' : '☆') + '</span>';
    }).join('');
  }

  function renderReviews(reviews) {
    if (!reviewList) return;
    reviewList.innerHTML = reviews.map(function (review) {
      return '<article class="review-card">' +
        '<div class="review-meta"><span class="review-name">' + review.name + '</span><span class="review-date">' + review.date + '</span></div>' +
        '<div class="review-stars">' + createStarMarkup(review.stars) + '</div>' +
        '<p>' + review.text + '</p>' +
        '</article>';
    }).join('');
  }

  function loadReviews() {
    try {
      return JSON.parse(localStorage.getItem(reviewStorageKey) || 'null') || [];
    } catch (e) {
      return [];
    }
  }

  function saveReviews(reviews) {
    try {
      localStorage.setItem(reviewStorageKey, JSON.stringify(reviews));
    } catch (e) {
      // ignore storage errors
    }
  }

  var defaultReviews = [
    { name: 'Aisha K.', stars: 5, text: 'The Muslim-friendly campus, prayer support and practical labs made GTTC the best choice for my career journey.', date: 'June 2026' },
    { name: 'Imran S.', stars: 5, text: 'Faith values are visible in every class. I also gained hands-on skills that helped me secure a job quickly.', date: 'May 2026' },
    { name: 'Maryam N.', stars: 4, text: 'The instructors are caring, the study environment is respectful, and the review form lets anyone share their experience.', date: 'April 2026' }
  ];

  var savedReviews = loadReviews();
  if (!savedReviews.length) {
    savedReviews = defaultReviews;
    saveReviews(savedReviews);
  }
  renderReviews(savedReviews);

  if (reviewForm) {
    reviewForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = reviewForm.querySelector('[name="reviewer"]').value.trim() || 'Anonymous';
      var reviewText = reviewForm.querySelector('[name="review"]').value.trim();
      var rating = Number(reviewForm.querySelector('[name="rating"]:checked').value || 5);
      if (!reviewText) {
        reviewForm.querySelector('[name="review"]').focus();
        return;
      }
      var newReview = { name: name, stars: rating, text: reviewText, date: 'Just now' };
      savedReviews.unshift(newReview);
      saveReviews(savedReviews);
      renderReviews(savedReviews);
      reviewForm.reset();
      reviewForm.querySelector('#rating-5').checked = true;
    });
  }
});
