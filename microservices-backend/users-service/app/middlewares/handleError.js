const handleError = (err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Error interno del servidor",
    },
  });
};

export default handleError;
