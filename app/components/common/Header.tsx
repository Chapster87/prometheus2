import { Link } from '@tanstack/react-router'
import logo from '~/assets/images/prometheus.svg';

export function Header() {
  return (
    <div className='header sticky top-0 left-0 w-full z-[100]'>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <Link
                  to="/movies"
                  activeProps={{
                    className: 'font-bold',
                  }}
                >Movies</Link>
              </li>
              <li>
                <Link
                  to="/shows"
                  activeProps={{
                    className: 'font-bold',
                  }}
                >Shows</Link>
              </li>
              <li>
                <a>Test Pages</a>
                <ul className="p-2">
                  <li>
                    <Link
                      to="/posts"
                      activeProps={{
                        className: 'font-bold',
                      }}
                    >Posts</Link></li>
                  <li>
                    <Link
                      to="/users"
                      activeProps={{
                        className: 'font-bold',
                      }}
                    >Users</Link>
                  </li>
                  <li>
                    <Link
                      to="/layout-a"
                      activeProps={{
                        className: 'font-bold',
                      }}
                    >Layout</Link>
                  </li>
                  <li>
                    <Link
                      to="/deferred"
                      activeProps={{
                        className: 'font-bold',
                      }}
                    >Deferred</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <Link
            to="/"
            className='btn btn-ghost text-xl'
            activeOptions={{ exact: true }}
          ><img src={logo} className="max-w-9 mr-2" alt="Prometheus" /> Prometheus 2.0</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link
                to="/movies"
                activeProps={{
                  className: 'font-bold',
                }}
              >Movies</Link>
            </li>
            <li>
              <Link
                to="/shows"
                activeProps={{
                  className: 'font-bold',
                }}
              >Shows</Link>
            </li>
            <li>
              <details>
                <summary>Test Pages</summary>
                <ul className="p-2">
                  <li>
                    <Link
                      to="/posts"
                      activeProps={{
                        className: 'font-bold',
                      }}
                    >Posts</Link></li>
                  <li>
                    <Link
                      to="/users"
                      activeProps={{
                        className: 'font-bold',
                      }}
                    >Users</Link>
                  </li>
                  <li>
                    <Link
                      to="/layout-a"
                      activeProps={{
                        className: 'font-bold',
                      }}
                    >Layout</Link>
                  </li>
                  <li>
                    <Link
                      to="/deferred"
                      activeProps={{
                        className: 'font-bold',
                      }}
                    >Deferred</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li><a>Item 3</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}