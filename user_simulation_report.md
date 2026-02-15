# User Map Simulation & Dead Route Analysis

## Objective
Simulate user journeys to identify dead links (`#`), missing pages, and unconnected features compared to the live [Fynor.com](https://www.fynor.com/en_US/).

## 1. Navigation Bar (Guest & User)
| Link | Target | Status | Fix Required |
|------|--------|--------|--------------|
| Logo | `index.html` | ✅ OK | |
| Market | `index.html#market` | ✅ OK | |
| **Spot Dropdown** | | | |
| - Classic Spot | `trade.html?type=spot&mode=classic` | ✅ OK | |
| - Quick Convert | `trade.html?type=spot&mode=convert` | ⚠️ UI Missing | `trade.html` handles query? |
| - Pro Trading | `trade.html?type=spot&mode=advanced` | ⚠️ UI Missing | `trade.html` handles query? |
| - Margin Trading | `trade.html?type=spot&mode=margin` | ⚠️ UI Missing | `trade.html` handles query? |
| **Futures Dropdown** | | | |
| - Perpetual | `trade.html?type=futures&contract=perpetual` | ⚠️ Logic Missing | `trade.html` handles query? |
| - Delivery | `trade.html?type=futures&contract=delivery` | ⚠️ Logic Missing | |
| - Coin-M | `trade.html?type=futures&contract=coin_perp` | ⚠️ Logic Missing | |
| **Earn Dropdown** | | | |
| - Staking | `#` | ❌ Dead | Needs Placeholder |
| - Savings | `#` | ❌ Dead | Needs Placeholder |
| - Launchpad | `#` | ❌ Dead | Needs Placeholder |
| Wallet | `wallet.html` | ✅ OK | |
| Orders | `orders.html` | ✅ OK | |
| Log In / Sign Up | Modals | ✅ OK | |
| Language | `#` | ❌ Dead | Low Priority |

## 2. Footer Links
| Section | Link | Target | Status |
|---------|------|--------|--------|
| About Us | About FYNOR | `#` | ❌ Dead |
| | Careers | `#` | ❌ Dead |
| Products | Spot Trading | `#` | ❌ Dead |
| | Margin Trading | `#` | ❌ Dead |
| Service | Help Center | `#` | ❌ Dead |
| | Fees | `#` | ❌ Dead |
| Support | Submit Request | `#` | ❌ Dead |
| Socials | Twitter/FB/etc | `#` | ❌ Dead |

## 3. User Flows
### Flow A: Registration & Login
1.  Click Sign Up -> Modal opens -> Submit -> **Backend API?**
2.  Click Log In -> Modal opens -> Submit -> **Backend API?** -> Store Token -> UI Update.

### Flow B: Trading
1.  Navigate to `trade.html`.
2.  **Chart**: TradingView Widget -> ✅ OK.
3.  **Order Book**: Live data? currently `generateOrderbook()` (Mock) vs `loadOrderBook` (WebSocket?).
    *   *Bug Suspicion*: `trade.html` calls `generateOrderbook()` (mock) on load, ignoring real data if available.
4.  **Place Order**: Form Submit -> `placeOrder()` -> Mock Alert. **Needs Backend Connection**.

### Flow C: Wallet
1.  `wallet.html` -> `loadWalletPage()` -> Fetch `/api/wallet` -> ✅ OK (if backend has it).
2.  Deposit -> `showDepositForm()` -> Modal? -> **Missing Logic**.
3.  Withdraw -> `showWithdrawForm()` -> Modal? -> **Missing Logic**.

## Action Plan
1.  **Fix Navigation**: Create a generic "Under Construction" page for dead links (Earn, About, etc.) or redirect them safely.
2.  **Connect Trading**: Update `trade.html` to use real API for placing orders instead of `alert()`.
3.  **Fix Order Book**: Switch from `generateOrderbook()` mock to `app.js` WebSocket/API data.
4.  **Implement Deposit/Withdraw**: Add simple modals for these actions in `components.js`.
