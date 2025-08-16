import React, { useState } from 'react'

const PackingInstructionsModal = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false)
  
  if (!data) return null

  const { loading, shipment, instructions, error } = data

  // Function to copy instructions to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(instructions)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  // Function to format AI-generated text into beautiful sections
  const formatInstructions = (text) => {
    if (!text) return text

    // Split the text into lines and filter empty ones
    const lines = text.split('\n').filter(line => line.trim())
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim()
      
      // Check if it's a header (starts with ##, #, or contains ":" and is short)
      if (trimmedLine.startsWith('##') || trimmedLine.startsWith('#')) {
        return (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            margin: '1.5rem 0 1rem 0',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '18px' }}>📦</span>
            {trimmedLine.replace(/#{1,3}\s*/, '')}
          </div>
        )
      }
      
      // Check if it's a bullet point
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        return (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            margin: '0.75rem 0',
            paddingLeft: '1rem',
            background: '#f8fffe',
            padding: '0.75rem',
            borderRadius: '6px',
            borderLeft: '4px solid #48bb78',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              marginRight: '0.75rem',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              ✓
            </span>
            <span style={{ flex: 1, lineHeight: '1.6', color: '#2d3748' }}>
              {trimmedLine.replace(/^[•\-*]\s*/, '')}
            </span>
          </div>
        )
      }
      
      // Check if it's a numbered list
      if (/^\d+\./.test(trimmedLine)) {
        const number = trimmedLine.match(/^(\d+)\./)[1]
        const content = trimmedLine.replace(/^\d+\.\s*/, '')
        return (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            margin: '1rem 0',
            padding: '1rem',
            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              marginRight: '1rem',
              flexShrink: 0,
              boxShadow: '0 2px 4px rgba(66, 153, 225, 0.3)'
            }}>
              {number}
            </div>
            <span style={{ flex: 1, lineHeight: '1.6', color: '#2d3748', fontSize: '15px' }}>
              {content}
            </span>
          </div>
        )
      }
      
      // Check if it's a section title (contains colons and is short)
      if (trimmedLine.includes(':') && trimmedLine.length < 100 && !trimmedLine.startsWith('http')) {
        const [title, ...rest] = trimmedLine.split(':')
        if (rest.length > 0) {
          return (
            <div key={index} style={{ 
              margin: '1.25rem 0 0.75rem 0',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
              borderRadius: '6px',
              borderLeft: '4px solid #e17055'
            }}>
              <div style={{
                color: '#2d3748',
                fontSize: '15px',
                fontWeight: 'bold',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>⚠️</span>
                {title.trim()}:
              </div>
              <div style={{ color: '#4a5568', lineHeight: '1.5', fontSize: '14px' }}>
                {rest.join(':').trim()}
              </div>
            </div>
          )
        }
      }
      
      // Regular paragraph
      if (trimmedLine.length > 0) {
        return (
          <p key={index} style={{
            margin: '1rem 0',
            lineHeight: '1.7',
            color: '#2d3748',
            fontSize: '15px',
            padding: '0.5rem 0'
          }}>
            {trimmedLine}
          </p>
        )
      }
      
      return null
    }).filter(Boolean)
  }

  return (
    <div className="modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="modal-content" style={{ 
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1.5rem 2rem',
          borderRadius: '16px 16px 0 0',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              AI Packing Instructions
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Shipment Details Card */}
          {shipment && (
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ 
                margin: '0 0 1rem 0', 
                color: '#2d3748',
                fontSize: '18px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>📋</span>
                Shipment Details
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                fontSize: '14px'
              }}>
                <div style={{ 
                  background: 'white', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong style={{ color: '#4a5568' }}>Item:</strong>
                  <div style={{ marginTop: '0.25rem', color: '#2d3748' }}>{shipment.description}</div>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong style={{ color: '#4a5568' }}>Type:</strong>
                  <div style={{ 
                    marginTop: '0.25rem', 
                    color: shipment.is_fragile ? '#e53e3e' : '#38a169',
                    fontWeight: '500'
                  }}>
                    {shipment.is_fragile ? '🔴 Fragile' : '🟢 Standard'}
                  </div>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong style={{ color: '#4a5568' }}>Method:</strong>
                  <div style={{ marginTop: '0.25rem', color: '#2d3748' }}>{shipment.shipping_method}</div>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong style={{ color: '#4a5568' }}>Route:</strong>
                  <div style={{ marginTop: '0.25rem', color: '#2d3748' }}>
                    {shipment.origin} → {shipment.destination}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: '6px solid #f3f3f3',
                borderTop: '6px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div style={{
                fontSize: '18px',
                color: '#4a5568',
                fontWeight: '500'
              }}>
                🤖 Generating AI packing instructions...
              </div>
              <div style={{
                fontSize: '14px',
                color: '#718096',
                maxWidth: '300px',
                lineHeight: '1.5'
              }}>
                Our AI is analyzing your shipment details to provide customized packing recommendations
              </div>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
              color: '#c53030',
              border: '1px solid #fc8181',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 4px 12px rgba(197, 48, 48, 0.15)'
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Error generating instructions
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Instructions Content */}
          {instructions && (
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)',
                border: '2px solid #4fd1c7',
                borderRadius: '16px',
                padding: '0',
                marginBottom: '2rem',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(79, 209, 199, 0.2)'
              }}>
                {/* Instructions Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #4fd1c7 0%, #38b2ac 100%)',
                  color: 'white',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    <span style={{ fontSize: '24px' }}>✨</span>
                    AI-Generated Packing Instructions
                  </div>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      background: copied ? '#38a169' : 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease',
                      minWidth: '100px',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      if (!copied) e.target.style.background = 'rgba(255, 255, 255, 0.3)'
                    }}
                    onMouseOut={(e) => {
                      if (!copied) e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {copied ? (
                      <>
                        <span>✅</span>
                        Copied!
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Instructions Content */}
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '0 0 14px 14px'
                }}>
                  {formatInstructions(instructions)}
                </div>
              </div>
              
              {/* Disclaimer */}
              <div style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                fontSize: '13px',
                color: '#4a5568',
                textAlign: 'center',
                marginBottom: '2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>
                    AI-Generated Content
                  </span>
                </div>
                <div style={{ lineHeight: '1.5' }}>
                  These instructions were generated by AI based on your shipment details. 
                  Please review and adapt them according to your specific needs, local regulations, 
                  and industry best practices.
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={onClose} 
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                minWidth: '120px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackingInstructionsModal
