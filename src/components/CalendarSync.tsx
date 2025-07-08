@@ .. @@
           {!isConnected ? (
             <button
               onClick={handleConnect}
               disabled={isLoading}
               style={{
                 backgroundColor: '#4285f4',
                 color: 'white',
                 border: 'none',
                 borderRadius: '8px',
                 padding: '12px 16px',
                 fontSize: '14px',
                 fontWeight: '600',
                 cursor: isLoading ? 'not-allowed' : 'pointer',
                 opacity: isLoading ? 0.7 : 1,
               }}
             >
               {isLoading ? 'Connecting...' : 'Connect to Google Calendar'}
             </button>
           ) : (
             <button
               onClick={handleDisconnect}
               disabled={isLoading}
               style={{
                 backgroundColor: '#ff6b6b',
                 color: 'white',
                 border: 'none',
                 borderRadius: '8px',
                 padding: '12px 16px',
                 fontSize: '14px',
                 fontWeight: '600',
                 cursor: isLoading ? 'not-allowed' : 'pointer',
                 opacity: isLoading ? 0.7 : 1,
               }}
             >
               Disconnect
             </button>
           )}
+
+          {/* Setup Instructions */}
+          {!isConnected && (
+            <div style={{
+              marginTop: '12px',
+              padding: '12px',
+              backgroundColor: theme.isDark ? 'rgba(66, 133, 244, 0.1)' : '#f0f4ff',
+              borderRadius: '8px',
+              fontSize: '12px',
+              color: theme.colors.textSecondary,
+            }}>
+              <p style={{ marginBottom: '8px', fontWeight: '600' }}>
+                📝 Setup Required:
+              </p>
+              <p style={{ marginBottom: '4px' }}>
+                1. Create a Google Cloud project
+              </p>
+              <p style={{ marginBottom: '4px' }}>
+                2. Enable Calendar API
+              </p>
+              <p style={{ marginBottom: '4px' }}>
+                3. Create OAuth 2.0 credentials
+              </p>
+              <p>
+                4. Add your credentials to environment variables
+              </p>
+            </div>
+          )}
         </div>