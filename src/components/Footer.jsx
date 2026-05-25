export default function Footer({ onPrivacy }) {
  return (
    <footer style={{
      borderTop: '1px solid #111',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#080808',
      flexShrink: 0,
      marginTop: 'auto',
    }}>
      <span style={{ fontSize: 11, color: '#333' }}>
        © 2026 InstaBot · Created by{' '}
        <a
          href="https://instagram.com/whoanuragbhatt"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#444', textDecoration: 'none', borderBottom: '1px solid #333' }}
        >
          @whoanuragbhatt
        </a>
      </span>
      <button
        type="button"
        onClick={onPrivacy}
        style={{ fontSize: 11, color: '#333', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: '#222' }}
      >
        Privacy Policy
      </button>
    </footer>
  )
}
