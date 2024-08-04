export default {
  SERVER_URL:
    window.location.hostname == "localhost"
      ? "http://127.0.0.1:5000/api/v1"
      : null,
};
