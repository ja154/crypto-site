// Component Loader

function loadHeader() {
    const headerHtml = `
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="index.html">
                        <img src="https://s3.ap-southeast-1.amazonaws.com/fynor/comjma17540568782486.png" alt="FYNOR" height="28">
                    </a>
                </div>

                <nav class="main-nav">
                    <a href="index.html#market" class="nav-link">Market</a>
                    <div class="dropdown">
                        <a href="#" class="nav-link">Spot <i class="fas fa-chevron-down"></i></a>
                        <div class="dropdown-content mega-menu">
                            <div class="dropdown-column">
                                <h3>Basic Trading</h3>
                                <a href="trade.html?type=spot&mode=classic">Classic Spot</a>
                                <a href="trade.html?type=spot&mode=convert">Quick Convert</a>
                            </div>
                            <div class="dropdown-column">
                                <h3>Advanced Trading</h3>
                                <a href="trade.html?type=spot&mode=advanced">Pro Trading</a>
                                <a href="trade.html?type=spot&mode=margin">Margin Trading</a>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown">
                        <a href="#" class="nav-link">Futures <i class="fas fa-chevron-down"></i></a>
                        <div class="dropdown-content mega-menu">
                             <div class="dropdown-column">
                                <h3>USDT-M Futures</h3>
                                <a href="trade.html?type=futures&contract=perpetual">Perpetual Contracts</a>
                                <a href="trade.html?type=futures&contract=delivery">Delivery Contracts</a>
                            </div>
                            <div class="dropdown-column">
                                <h3>COIN-M Futures</h3>
                                <a href="trade.html?type=futures&contract=coin_perp">Inverse Perpetual</a>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown">
                        <a href="#" class="nav-link">AIEX <i class="fas fa-chevron-down"></i></a>
                        <div class="dropdown-content">
                            <a href="#" onclick="showComponentsAlert('AI Tools')">AI Tools</a>
                            <a href="#" onclick="showComponentsAlert('Analytics')">Analytics</a>
                        </div>
                    </div>
                </nav>

                <div class="header-actions">
                    <div class="top-controls">
                        <a href="#" class="small-link" onclick="window.location.href='login.html'">Log In</a>
                        <button class="btn btn-primary btn-sm" onclick="window.location.href='register.html'">Sign Up</button>
                        <a href="#" class="small-icon" title="Download"><i class="fas fa-download"></i></a>
                        <a href="#" class="small-icon" title="Toggle theme"><i class="fas fa-sun"></i></a>
                        <a href="#" class="small-link">English</a>
                    </div>
                    <div id="userMenu" class="user-menu" style="display: none;">
                        <button class="btn btn-icon" onclick="toggleUserDropdown()">
                            <img id="userAvatar" src="" alt="User" class="avatar">
                            <span id="userName"></span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div id="userDropdown" class="dropdown-content" style="display: none;">
                            <a href="wallet.html">Wallet</a>
                            <a href="orders.html">Orders</a>
                            <a href="#">Security Settings</a>
                            <a href="#">API Management</a>
                            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 0.5rem 0;">
                            <a href="#" onclick="logout()">Log Out</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;

    document.getElementById('header-container').innerHTML = headerHtml;
    highlightActiveLink();
}

function loadFooter() {
    const footerHtml = `
    <footer class="footer">
        <div class="container">
            <div class="footer-content-grid">
                <div class="footer-brand">
                    <img src="https://s3.ap-southeast-1.amazonaws.com/fynor/comjma17540568782486.png" alt="FYNOR" height="40">
                    <p style="margin-top: 1rem; color: var(--text-secondary);">The Most Trustworthy Blockchain Digital Asset Exchange</p>
                    <div class="footer-social">
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-telegram"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                
                <div class="footer-column">
                    <h4>About Us</h4>
                    <a href="#" onclick="showComponentsAlert('About Us')">About FYNOR</a>
                    <a href="#" onclick="showComponentsAlert('Careers')">Careers</a>
                    <a href="#" onclick="showComponentsAlert('Business Contacts')">Business Contacts</a>
                    <a href="#" onclick="showComponentsAlert('Community')">Community</a>
                </div>

                <div class="footer-column">
                    <h4>Products</h4>
                    <a href="#" onclick="showComponentsAlert('Spot Trading')">Spot Trading</a>
                    <a href="#" onclick="showComponentsAlert('Margin Trading')">Margin Trading</a>
                    <a href="#" onclick="showComponentsAlert('Futures Trading')">Futures Trading</a>
                    <a href="#" onclick="showComponentsAlert('Earn')">Earn</a>
                    <a href="#" onclick="showComponentsAlert('Launchpad')">Launchpad</a>
                </div>

                <div class="footer-column">
                    <h4>Service</h4>
                    <a href="#" onclick="showComponentsAlert('Help Center')">Help Center</a>
                    <a href="#" onclick="showComponentsAlert('Fees')">Fees</a>
                    <a href="#" onclick="showComponentsAlert('Security')">Security</a>
                    <a href="#" onclick="showComponentsAlert('Referral')">Referral Program</a>
                    <a href="#" onclick="showComponentsAlert('API')">API Documentation</a>
                </div>

                <div class="footer-column">
                    <h4>Support</h4>
                    <a href="#" onclick="showComponentsAlert('Submit Request')">Submit Request</a>
                    <a href="#" onclick="showComponentsAlert('Legal')">Legal</a>
                    <a href="#" onclick="showComponentsAlert('User Agreement')">User Agreement</a>
                    <a href="#" onclick="showComponentsAlert('Privacy Policy')">Privacy Policy</a>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>Copyright © 2026 FYNOR. All rights reserved</p>
            </div>
        </div>
    </footer>
    `;

    document.getElementById('footer-container').innerHTML = footerHtml;
}

function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop() ||
            (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function loadModals() {
    const modalsHtml = `
        < !--Login Modal -->
            <div id="loginModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="closeModal('loginModal')">&times;</span>
                    <h2>Log In</h2>
                    <form id="loginForm" onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label>Email / Phone Number</label>
                            <input type="text" id="loginEmail" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="loginPassword" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Log In</button>
                    </form>
                    <div class="divider">OR</div>
                    <button class="btn btn-google btn-full" onclick="loginWithGoogle()">
                        <i class="fab fa-google"></i> Continue with Google
                    </button>
                        <p class="modal-footer">
                        Don't have an account? <a href="register.html">Sign Up</a>
                        <br><br>
                            <a href="#">Forgot Password?</a>
                        </p>
                        </div>
                </div>

                <!-- Register Modal -->
                <div id="registerModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeModal('registerModal')">&times;</span>
                        <h2>Create Account</h2>
                        <form id="registerForm" onsubmit="handleRegister(event)">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" id="registerName" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="registerEmail" required>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" id="registerPassword" required minlength="6">
                            </div>
                            <div class="form-group">
                                <label>Referral Code (Optional)</label>
                                <input type="text" id="referralCode">
                            </div>
                            <div class="form-group">
                                <input type="checkbox" id="terms" required>
                                    <label for="terms" style="display:inline; font-size: 0.9rem;">I agree to the <a href="#">Terms of Service</a></label>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Sign Up</button>
                        </form>
                        <div class="divider">OR</div>
                        <button class="btn btn-google btn-full" onclick="loginWithGoogle()">
                            <i class="fab fa-google"></i> Continue with Google
                        </button>
                        <p class="modal-footer">
                            Already have an account? <a href="login.html">Log In</a>
                        </p>
                    </div>
                </div>

                <!-- Wallet Modal -->
                <div id="walletModal" class="modal">
                    <div class="modal-content modal-large">
                        <span class="close" onclick="closeModal('walletModal')">&times;</span>
                        <h2>My Assets</h2>
                        <div class="wallet-container">
                            <div class="wallet-balances" id="walletBalances">
                                <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                                    <i class="fas fa-spinner fa-spin"></i> Loading...
                                </div>
                            </div>
                            <div class="wallet-actions">
                                <button class="btn btn-primary" onclick="showDepositModal()">Deposit</button>
                                <button class="btn btn-outline" onclick="showWithdrawModal()">Withdraw</button>
                                <button class="btn btn-outline" onclick="window.location.href='orders.html'">Order History</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Deposit Modal -->
                <div id="depositModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeModal('depositModal')">&times;</span>
                        <h2>Deposit Assets</h2>
                        <div class="form-group">
                            <label>Select Coin</label>
                            <select id="depositCurrency" class="order-input" style="width: 100%; padding: 0.75rem; background: var(--bg-darker); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px;">
                                <option value="USDT">USDT (Tether)</option>
                                <option value="BTC">BTC (Bitcoin)</option>
                                <option value="ETH">ETH (Ethereum)</option>
                            </select>
                        </div>
                        <div style="text-align: center; margin: 2rem 0;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x1234567890abcdef1234567890abcdef12345678" alt="QR Code" style="border-radius: 8px;">
                                <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-secondary);">Scan QR code to deposit</p>
                        </div>
                        <div class="form-group">
                            <label>Deposit Address</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="text" value="0x1234567890abcdef1234567890abcdef12345678" readonly>
                                    <button class="btn btn-outline" onclick="copyToClipboard('0x1234567890abcdef1234567890abcdef12345678')"><i class="fas fa-copy"></i></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Withdraw Modal -->
                <div id="withdrawModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeModal('withdrawModal')">&times;</span>
                        <h2>Withdraw Assets</h2>
                        <form onsubmit="handleWithdraw(event)">
                            <div class="form-group">
                                <label>Select Coin</label>
                                <select id="withdrawCurrency" class="order-input" style="width: 100%; padding: 0.75rem; background: var(--bg-darker); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px;">
                                    <option value="USDT">USDT (Tether)</option>
                                    <option value="BTC">BTC (Bitcoin)</option>
                                    <option value="ETH">ETH (Ethereum)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Withdraw Address</label>
                                <input type="text" id="withdrawAddress" placeholder="Enter wallet address" required>
                            </div>
                            <div class="form-group">
                                <label>Amount</label>
                                <input type="number" id="withdrawAmount" step="0.00000001" placeholder="0.00" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Withdraw</button>
                        </form>
                    </div>
                </div>
                `;

    // Append to body
    const div = document.createElement('div');
    div.innerHTML = modalsHtml;
    document.body.appendChild(div);
}

// Execute on load
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    loadModals();
});

function showComponentsAlert(feature) {
    if (window.showAlert) {
        window.showAlert(feature + ' feature is coming soon!', 'info');
    } else {
        alert(feature + ' feature is coming soon!');
    }
}
window.showComponentsAlert = showComponentsAlert;
