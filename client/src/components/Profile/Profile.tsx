import { useState, useEffect } from 'react'
import axios from 'axios'

type UserProfile = {
  given_name?: string
  name?: string
  email?: string
  picture?: string
  nickname?: string
}

const Profile = () => {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/profile', {
          withCredentials: true,
        })
        setUser(response.data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

const handleLogout = () => {
    window.location.href = `http://localhost:3000/logout`
  }


  if (loading) {
    return (
      <div style={{ padding: '100px 40px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          <div
            style={{
              backgroundColor: '#e7e1d9',
              height: 120,
              width: 120,
              borderRadius: '50%',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              backgroundColor: '#e7e1d9',
              height: 24,
              width: '60%',
              borderRadius: 4,
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <div style={{
              backgroundColor: '#e7e1d9',
              height: 16,
              width: '40%',
              borderRadius: 4,
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ padding: '100px 40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '28px',
          color: '#1f1b18',
          marginBottom: '12px',
        }}>
          Not logged in
        </h2>
        <p style={{ color: '#9a8f82', fontSize: '16px' }}>
          Please log in to view your profile.
        </p>
      </div>
    )
  }

  const displayName = user.given_name || user.name || "User";

return (
  <div
    style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "80px 40px",
    }}
  >
    <p
      style={{
        color: "#b58f3a",
        textTransform: "uppercase",
        letterSpacing: "4px",
        fontSize: "14px",
        marginBottom: "16px",
      }}
    >
      Your Account
    </p>

    <h1
      style={{
        margin: "35px 0",
        fontWeight: 300,
        fontSize: "52px",
      }}
    >
      Profile
    </h1>

    <p
      style={{
        color: "#746b5f",
        fontSize: "18px",
        lineHeight: 1.6,
        maxWidth: "700px",
        marginBottom: "48px",
      }}
    >
      Sign in to keep track of the gyms you've rated and find what other lifters across Sweden think about gyms you want to visit.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        marginBottom: "40px",
      }}
    >
      {/* User Info */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "28px",
          background: "white",
        }}
      >
        <p
          style={{
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontSize: "14px",
            color: "#746b5f",
            marginBottom: "20px",
          }}
        >
          Account Details
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {user.picture && (
            <img
              src={user.picture}
              alt={displayName}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}

          <div>
            <div
              style={{
                fontSize: "20px",
                color: "var(--text-h)",
                marginBottom: "4px",
                fontWeight: 600,
              }}
            >
              {displayName}
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#8f8578",
              }}
            >
              {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "28px",
          background: "white",
        }}
      >
        <p
          style={{
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontSize: "14px",
            color: "#746b5f",
            marginBottom: "20px",
          }}
        >
          Reviews Written
        </p>

        <div
          style={{
            fontSize: "40px",
            fontFamily: "var(--heading)",
            color: "var(--text-h)",
          }}
        >
          —
        </div>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        gap: "14px",
      }}
    >
      <button className="button primary"
        onClick={handleLogout}
      >
        Sign out
      </button>

      <button
        onClick={() => (window.location.href = "/")}
        className="button"
      >
        Browse gyms
      </button>
    </div>
  </div>
);
}
export default Profile