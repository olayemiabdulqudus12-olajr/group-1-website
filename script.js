const masterProductCatalog = {
    "65 tv": {
        title: "Nexis Ultra 65-Inch 4K Smart TV",
        price: 799,
        floor: 650,
        img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500",
        downsellKey: "55 tv"
    },
    "55 tv": {
        title: "Pro Cinematic 55-Inch OLED TV",
        price: 549,
        floor: 450,
        img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
        downsellKey: "32 tv"
    },
    "32 tv": {
        title: "Compact 32-Inch HD LED Smart TV",
        price: 249,
        floor: 195,
        img: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500",
        downsellKey: null
    },
    "watch": {
        title: "Titanium Sports Luxury Chronograph Watch",
        price: 299,
        floor: 220,
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        downsellKey: null
    },
    "telephone": {
        title: "Nexis Phone Pro Max 5G (512GB)",
        price: 999,
        floor: 850,
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        downsellKey: null
    },
    "laptop": {
        title: "Zenith Pro 15-Inch Workstation Laptop",
        price: 1299,
        floor: 1100,
        img: "https://images.unsplash.com/photo-1496181130204-755241524eab?w=500",
        downsellKey: null
    },
    "desktop": {
        title: "Apex Core RGB Liquid-Cooled Gaming Desktop",
        price: 1599,
        floor: 1400,
        img: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500",
        downsellKey: null
    },
    "charger": {
        title: "HyperVolt 120W Rapid Multi-Port Charger",
        price: 49,
        floor: 35,
        img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500",
        downsellKey: null
    }
};

let activeProduct = masterProductCatalog["65 tv"]; 
let isDealClosed = false;
let itemsInCart = 0;

document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submit-offer-btn");
    const offerInput = document.getElementById("user-offer-input");
    const chatViewport = document.getElementById("chat-box");

    // Account Modal Element Hooks
    const accountToggle = document.getElementById("account-toggle");
    const registerModal = document.getElementById("register-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");

    if (submitBtn && offerInput) {
        submitBtn.addEventListener("click", () => handleInputCycle());
        offerInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleInputCycle(); });
    }

    // Modal Events Configurations
    if (accountToggle && registerModal && closeModalBtn) {
        accountToggle.addEventListener("click", () => registerModal.classList.add("active"));
        closeModalBtn.addEventListener("click", () => registerModal.classList.remove("active"));
        
        // Close modal if user clicks outside of the registration card structure
        window.addEventListener("click", (e) => {
            if (e.target === registerModal) registerModal.classList.remove("active");
        });
    }

    function handleInputCycle() {
        const rawText = offerInput.value.trim();
        if (rawText === "") return;

        appendBubble(rawText, "user");
        offerInput.value = "";

        const cleanInput = rawText.toLowerCase();
        
        // Exact word boundary matching regex strategy to avoid collision issues
        const matchedKey = Object.keys(masterProductCatalog).find(key => {
            const regex = new RegExp(`\\b${key}\\b`, 'i');
            return regex.test(cleanInput);
        });
        
        const numericOffer = extractNumber(cleanInput);

        setTimeout(() => {
            if (matchedKey) {
                activeProduct = masterProductCatalog[matchedKey];
                isDealClosed = false;
                syncShowcaseDisplay();
                appendBubble(`Loaded selection choice: <strong>${activeProduct.title}</strong>. Retail price is $${activeProduct.price}. Make me an offer!`, "bot");
            } 
            else if (numericOffer !== null) {
                processBargainPrice(numericOffer);
            } 
            else {
                appendBubble("We don't carry that item category. We only carry: <strong>Watch, Telephone, Laptop, Desktop, Charger, 65 TV, 55 TV, and 32 TV</strong>. Type an item name or enter a dollar bargain offer!", "bot");
            }
        }, 500);
    }

    function processBargainPrice(offer) {
        if (isDealClosed) {
            appendBubble("This specific checkout route has already been finalized. Type an alternative item name to initiate a new session!", "bot");
            return;
        }

        if (offer >= activeProduct.price) {
            appendBubble(`<strong>Deal accepted!</strong> $${offer} is excellent. Adding ${activeProduct.title} to your official cart matrix now!`, "bot");
            triggerCartAddition();
        } 
        else if (offer >= activeProduct.floor) {
            appendBubble(`Bargain authorized! I am permitted to reduce the retail price to match your <strong>$${offer}</strong> budget value today. Added to your cart!`, "bot");
            triggerCartAddition();
        } 
        else {
            appendBubble(`I cannot accept $${offer} for the ${activeProduct.title}. That drops below our active wholesale cost boundaries.`, "bot");
            
            if (activeProduct.downsellKey) {
                const nextKey = activeProduct.downsellKey;
                appendBubble(`However, considering your budget framework, look at our alternative profile step down: <strong>${masterProductCatalog[nextKey].title}</strong> for only $${masterProductCatalog[nextKey].price}! Updating showcase gallery...`, "bot");
                
                setTimeout(() => {
                    activeProduct = masterProductCatalog[nextKey];
                    syncShowcaseDisplay();
                    appendBubble(`Display changed over to <strong>${activeProduct.title}</strong> ($${activeProduct.price}). What offer can you place on this variant option?`, "bot");
                }, 1500);
            } else {
                appendBubble(`Our lowest absolute margin floor limit for this configuration is <strong>$${activeProduct.floor}</strong>. Let me know if you can meet this parameter.`, "bot");
            }
        }
    }

    function triggerCartAddition() {
        isDealClosed = true;
        itemsInCart += 1;
        document.getElementById("cart-count").textContent = itemsInCart;
        
        // Add a clean visual pop effect to the cart indicator
        const cartCountEl = document.getElementById("cart-count");
        cartCountEl.style.color = "#2ed573";
        setTimeout(() => { cartCountEl.style.color = "white"; }, 1000);
    }

    function syncShowcaseDisplay() {
        document.getElementById("main-prod-img").src = activeProduct.img;
        document.getElementById("display-title").textContent = activeProduct.title;
        document.getElementById("display-price").textContent = `$${activeProduct.price}`;
        document.getElementById("display-badge").textContent = activeProduct.price > 500 ? "PREMIUM DEAL" : "VALUE ADVANTAGE";
        document.getElementById("crumb-name").textContent = activeProduct.title.split(' ').slice(-2).join(' ');
    }

    function extractNumber(text) {
        const matches = text.match(/\d+/);
        return matches ? parseInt(matches[0]) : null;
    }

    function appendBubble(messageText, authorClass) {
        const structuralBubble = document.createElement("div");
        structuralBubble.classList.add("chat-bubble", authorClass);
        structuralBubble.innerHTML = messageText;
        chatViewport.appendChild(structuralBubble);
        chatViewport.scrollTop = chatViewport.scrollHeight;
    }
});

// Standalone Modal Registration Submit Alert Router
function handleRegistration() {
    alert("Account successfully processed and registered! Welcome to Nexis MegaMarket.");
    document.getElementById("register-modal").classList.remove("active");
    document.getElementById("account-toggle").textContent = "👤 Welcome Back!";
}