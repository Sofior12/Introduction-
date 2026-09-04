// ===== send.js - Message Sending API Client =====

/**
 * Send a secret message to the server
 * @param {Object} data - { sender, text, color }
 * @returns {Promise} - Response from server
 */
async function sendSecretMessage(data) {
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: data.sender || 'Anonymous',
                text: data.text,
                color: data.color || '#ffd700',
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

/**
 * Get all secret messages
 * @returns {Promise} - List of messages
 */
async function getSecretMessages() {
    try {
        const response = await fetch('/api/messages');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

/**
 * Delete a secret message by ID
 * @param {number} id - Message ID
 * @returns {Promise} - Response
 */
async function deleteSecretMessage(id) {
    try {
        const response = await fetch(`/api/messages/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
}

// ===== Export for use in other files =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendSecretMessage, getSecretMessages, deleteSecretMessage };
}

// ===== Browser usage =====
// Make functions globally available
window.sendSecretMessage = sendSecretMessage;
window.getSecretMessages = getSecretMessages;
window.deleteSecretMessage = deleteSecretMessage;

console.log('📨 send.js loaded — Secret Message API client ready!');
