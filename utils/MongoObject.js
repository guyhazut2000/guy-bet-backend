function isObjectId(id) {
  if (!typeof id === "string") {
    return false;
  }
  // confirm valid ObjectId
  if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
    return false;
  }
  return true;
}

module.exports = {
  isObjectId,
};
