export const notificationSchema = (body) => {
  const errors = [];
  if (!body.title) errors.push('Title is required.');
  if (!body.message) errors.push('Message is required.');
  if (!['single', 'all'].includes(body.recipientType)) errors.push('Recipient type must be single or all.');
  if (body.recipientType === 'single' && !body.targetUserId) errors.push('Target user is required for single notification.');
  return errors;
};
