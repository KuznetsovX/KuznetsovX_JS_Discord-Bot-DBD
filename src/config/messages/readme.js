/**
 * @typedef {Object} Readme
 * @property {string[]} RULES_TEXT - List of server rules
 * @property {string[]} ROLES_TEXT - Instructions and roles text
 */

/** @type {Readme} */
const README = {
    RULES_TEXT: [
        "• Treat everyone with respect.",
        "• No spam or self-promotion without staff permission.",
        "• No age-restricted or obscene content (text, images, or links)."
    ],
    ROLES_TEXT: [
        "Click emoji below to get a corresponding role **(requires bot to be online)**:",
        "🔔 Notifications",
        "",
        "Alternatively, use commands. Type `!help` when the bot is online."
    ]
};

export default README;
