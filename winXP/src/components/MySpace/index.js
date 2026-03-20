import React, { useState, useRef } from 'react';
import './myspace.css';
import MySpaceMusicPlayer from './MySpaceMusicPlayer';

const USER_NAME = 'Kaya Wesley';
const FRIENDS = [
  { name: 'Tom', img: 'tom.jpg' },
  { name: '𝓯𝓻𝓲𝓳𝓸𝓵', img: 'frijol.jpg' },
  { name: '❤꧁ღ⊱♥ Tia ♥⊱ღ꧂❤', img: 'jale.jpg' },
  { name: 'ｓｈｕｇｉ　ホ央維', img: 'shugi.JPEG' },
  { name: '𝕽𝕽𝕵', img: 'RRJ.png' },
  { name: '𝕕✫𝕧𝕖', img: 'dave.jpg' },
  { name: 'Zeke 2', img: 'zeke-chihuahua.jpg' },
  { name: 'CoolDog420', img: 'cooldog420.jpg' },
];

/* Set to true to use Tom's archived MySpace profile (Interests, Details, Schools, etc.) */
const USE_TOM_PRESET = false;

/* Interests - Tom's layout: General, Music, Movies, Television, Books, Heroes */
const DEFAULT_INTERESTS = [
  { category: 'General', content: 'Internet, Movies, Reading, Hiking, Travel, Creative projects' },
  { category: 'Music', content: 'Various bands and artists. Update with your favorites.' },
  { category: 'Movies', content: 'Update with your favorite films.' },
  { category: 'Games', content: 'Update with your favorite games.' },
  { category: 'Television', content: 'Update with your favorite shows.' },
  { category: 'Books', content: 'Update with your favorite books or authors.' },
  { category: 'Sports / Teams', content: 'Update with your favorite sports and teams.' },
  { category: 'Heroes', content: 'Update with people who inspire you.' },
];

/* Tom's Interests from archived profile (Nov 2007) */
const TOM_INTERESTS = [
  { category: 'General', content: 'Internet, Movies, Reading, Karaoke, Language, Culture, History of Communism, Philosophy, Singing/Writing Music, Running, Finding New Food, Hiking, Travel, Building alternate communities' },
  { category: 'Music', content: 'Bands: Beatles, Superdrag, Jackson 5, Weezer, Sex Pistols, Radiohead, The Doors, KISS... Solo Artists: Billy Joel, Bruce Springsteen, Elvis, David Bowie... Films: Lawrence of Arabia, Ben Hur, Patton... Directors: Kubrick, Coppola, Spielberg' },
  { category: 'Movies', content: 'Lawrence of Arabia, Ben Hur, Patton, Spartacus, Gandhi, The Godfather, Blade Runner, Good Will Hunting... Directors: Kubrick, Francis Coppola, Steven Spielberg' },
  { category: 'Games', content: 'Minesweeper, Pinball, Solitaire' },
  { category: 'Television', content: 'Desperate Housewives, Lost, 24, American Idol, Grey\'s Anatomy, Prison Break' },
  { category: 'Books', content: 'Nietzsche, George Orwell, Milan Kundera, Laurens van der Post' },
  { category: 'Sports / Teams', content: 'Update with your favorite sports and teams.' },
  { category: 'Heroes', content: 'Friedrich Nietzsche, Laurens van der Post, Frederick Dolan' },
];

/* Details - Tom's layout: Status, Here for, Hometown, Ethnicity, Zodiac, Smoke/Drink, Education, Occupation */
const DEFAULT_DETAILS = [
  { label: 'Status:', value: 'Single' },
  { label: 'Here for:', value: 'For memories' },
  { label: 'Hometown:', value: 'Frankfurt, Germany' },
  { label: 'Ethnicity:', value: 'African American / Turkish' },
  { label: 'Zodiac Sign:', value: 'Virgo', href: '#virgo' },
  { label: 'Smoke / Drink:', value: 'No / No' },
  { label: 'Education:', value: 'High School / Some College' },
  {
    label: 'Occupation:',
    content: (
      <>CEO of <a href="https://opaius.com" target="winxp_external" rel="noopener noreferrer" className="details-link">Opaius</a> & <a href="https://trendsetters.me" target="winxp_external" rel="noopener noreferrer" className="details-link">TREND$ETTER$</a></>
    ),
  },
];

const TOM_DETAILS = [
  { label: 'Status:', value: 'Single' },
  { label: 'Here for:', value: 'Friends' },
  { label: 'Hometown:', value: 'Los Angeles' },
  { label: 'Ethnicity:', value: 'White / Caucasian' },
  { label: 'Zodiac Sign:', value: 'Libra', href: '#libra' },
  { label: 'Smoke / Drink:', value: 'No / No' },
  { label: 'Education:', value: 'Grad / professional school' },
  { label: 'Occupation:', value: 'President, MySpace' },
];

/* Schools - Tom's layout: name, location, graduated, yearsAttended, major, clubs, status */
const DEFAULT_SCHOOLS = [
  { name: 'University Name', location: 'City, STATE', graduated: '2020', yearsAttended: '2016 to 2020', major: 'Your Major', clubs: '', status: 'Alumni' },
];

const TOM_SCHOOLS = [
  { name: 'University Of California-Los Angeles', location: 'Los Angeles, CALIFORNIA', graduated: '2000', yearsAttended: '1999 to 2001', major: 'Film - Critical Studies', clubs: '', status: 'Alumni' },
  { name: 'University Of California-Berkeley', location: 'Berkeley, CALIFORNIA', graduated: '1998', yearsAttended: '1994 to 1998', major: 'English & Rhetoric', clubs: 'DECAL: Literary Theory', status: 'Alumni' },
];

const INTERESTS = USE_TOM_PRESET ? TOM_INTERESTS : DEFAULT_INTERESTS;
const DETAILS = USE_TOM_PRESET ? TOM_DETAILS : DEFAULT_DETAILS;
const SCHOOLS = USE_TOM_PRESET ? TOM_SCHOOLS : DEFAULT_SCHOOLS;

/* Display name in section headers - use 'Tom' when preset is on so headers match Tom's profile */
const PROFILE_NAME = USE_TOM_PRESET ? 'Tom' : USER_NAME;

/* Profile-level config - switches when USE_TOM_PRESET */
const PROFILE_LOCATION = USE_TOM_PRESET ? 'Santa Monica, CALIFORNIA' : 'Monterey, CALIFORNIA';
const PROFILE_TAGLINE = USE_TOM_PRESET ? '":-)"' : '"This is my tagline!"';
const PROFILE_MOOD = USE_TOM_PRESET ? 'busy' : 'productive';
const PROFILE_MOOD_GIF = USE_TOM_PRESET ? 'busy.gif' : 'productive.gif';
const MYSPACE_URL = USE_TOM_PRESET ? 'http://www.myspace.com/tom' : 'http://www.myspace.com/kayawesley';
const STATUS_MESSAGE = USE_TOM_PRESET ? 'Tom testing out the new status' : `${USER_NAME} is in your extended network`;
const FRIEND_COUNT = USE_TOM_PRESET ? 212406909 : 8;

/* Tom's blurbs from archived profile */
const BLURB_ABOUT = USE_TOM_PRESET
  ? "I'm Tom and I'm here to help you. Send me a message if you're confused by anything. Before asking me a question, please check the FAQ to see if your question has already been answered.\n\nI may have been on your friend list when you signed up. If you don't want me to be, click \"Edit Friends\" and remove me! Also, feel free to tell me what features you want to see on MySpace and if I think it's cool, we'll do it!"
  : "Add a few lines about yourself here. Share what you're into, what you're working on, or anything you want people to know when they stop by your page.";
const BLURB_WHO = USE_TOM_PRESET
  ? "I'd like to meet people who educate, inspire or entertain me... I have a few close friends I've known all my life. I'd like to make more."
  : "Open to meeting new people. Down for good hangouts, interesting chats, and making genuine connections.";

/* Blog entries - Tom's from archive */
const BLOG_ENTRIES = USE_TOM_PRESET
  ? [
      { title: 'myspace updates!', href: '#blog1' },
      { title: 'new homepage look', href: '#blog2' },
      { title: "what's going on with friend counts?", href: '#blog3' },
      { title: 'extended network', href: '#blog4' },
      { title: 'am i online?', href: '#blog5' },
    ]
  : [{ title: `${USER_NAME}'s first blog entry`, href: '#blog' }];

const SEARCH_TABS = [
  { id: 'tms', label: 'MySpace' },
  { id: 'tpeople', label: 'People' },
  { id: 'tweb', label: 'Web' },
  { id: 'tmusic', label: 'Music' },
  { id: 'tvideos', label: 'Music Videos' },
  { id: 'tblog', label: 'Blogs' },
];

function MySpace({ openApp }) {
  const [navOpen, setNavOpen] = useState(false);
  const [searchTab, setSearchTab] = useState('tms');
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const commentBodyRef = useRef(null);

  function wrapSelection(openTag, closeTag) {
    const ta = commentBodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;
    const newVal = val.substring(0, start) + openTag + val.substring(start, end) + closeTag + val.substring(end);
    setCommentBody(newVal);
    requestAnimationFrame(() => {
      ta.selectionStart = start + openTag.length;
      ta.selectionEnd = end + openTag.length;
      ta.focus();
    });
  }

  function submitComment(e) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    setComments(prev => [...prev, { name: commentName.trim() || 'Anonymous', body: commentBody, date }]);
    setCommentBody('');
    setCommentName('');
  }

  const lastLogin = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  const img = path => `${process.env.PUBLIC_URL || ''}/myspace/${path}`;

  return (
    <div className="myspace-profile">
      <div className="container">
        <header className="myspace-header">
          {/* #header - archive structure: height 140px, float layout */}
          <div className="header-top" id="header">
            <div className="right header-outer">
              <div className="right">
                <div className="international">
                  <a href="#espanol">MySpace en Español</a>
                  {' | '}
                  <a href="#international"><img src={img('images/globe.gif')} alt="" align="top" />International</a>
                  {' | '}
                </div>
                <a href="#help">Help</a>
                {' | '}
                <a
                  href="#signup"
                  onClick={e => {
                    e.preventDefault();
                    openApp?.('LogOn');
                  }}
                >
                  SignUp
                </a>
              </div>
              <div className="clear"></div>
              <div className="header-search-row">
                <div id="logo">
                  <a href="#home"><img src={img('images/LogoDotcom.gif')} alt="MySpace" /></a>
                </div>
                <div id="header_search">
                  <form name="srch" id="srch" onSubmit={e => e.preventDefault()}>
                    <div id="row0" className="show">
                      {SEARCH_TABS.map(({ id, label }) => (
                        <React.Fragment key={id}>
                          <a href={`#${id}`} className={searchTab === id ? 'active' : 'inactive'} onClick={e => { e.preventDefault(); setSearchTab(id); }}>{label}</a>
                          {id !== 'tblog' ? ' | ' : null}
                        </React.Fragment>
                      ))}
                      <a href="#more" className="more" onClick={e => e.preventDefault()} aria-label="More">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='7' viewBox='0 0 7 7'%3E%3Cpath fill='%23ff6600' d='M2 0v7l5-3.5z'/%3E%3C/svg%3E" alt="" width={7} style={{ border: 'none', verticalAlign: 'middle' }} />
                      </a>
                    </div>
                    <div className="search-input-row">
                      <input type="text" id="q" name="q" className="txt" readOnly aria-label="Search" />
                      <input type="submit" id="submitBtn" value="Search" />
                    </div>
                  </form>
                </div>
                <div className="googleLogo-wrap">
                  <img src={img('images/powered_by_google.gif')} alt="Powered by Google" className="googleLogo" />
                </div>
              </div>
            </div>
          </div>
          {/* Bottom band: #6698CB - full width, touches top band, no gap */}
          <nav className={`header-nav ${navOpen ? 'showNav' : ''}`} id="nav">
            <div className="header-inner">
              <a href="#home">Home</a>
              <span className="nav-pipe">|</span>
              <a href="#browse">Browse</a>
              <span className="nav-pipe">|</span>
              <a href="#search">Search</a>
              <span className="nav-pipe">|</span>
              <a href="#invite">Invite</a>
              <span className="nav-pipe">|</span>
              <a href="#film">Film</a>
              <span className="nav-pipe">|</span>
              <a href="#mail">Mail</a>
              <span className="nav-pipe">|</span>
              <a href="#blog">Blog</a>
              <span className="nav-pipe">|</span>
              <a href="#favorites">Favorites</a>
              <span className="nav-pipe">|</span>
              <a href="#forum">Forum</a>
              <span className="nav-pipe">|</span>
              <a href="#groups">Groups</a>
              <span className="nav-pipe">|</span>
              <a href="#events">Events</a>
              <span className="nav-pipe">|</span>
              <a href="#videos">Videos</a>
              <span className="nav-pipe">|</span>
              <a href="#music">Music</a>
              <span className="nav-pipe">|</span>
              <a href="#comedy">Comedy</a>
              <span className="nav-pipe">|</span>
              <a href="#classifieds">Classifieds</a>
            </div>
          </nav>
          <button
            id="menuToggle"
            className={navOpen ? 'open' : ''}
            onClick={() => setNavOpen(!navOpen)}
            type="button"
            aria-label="Toggle navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
            </svg>
          </button>
        </header>
        <div className="main">
          <div className="left">
            <div className="profile">
              <div className="profilePicture">
                <h2 className="userName">{PROFILE_NAME}</h2>
                <img
                  src={img('images/user.jpg')}
                  alt=""
                  style={{ display: 'block', width: '170px', height: '170px', objectFit: 'cover', objectPosition: 'center 20%' }}
                />
                <p className="mood">
                  <strong>Mood:</strong> {PROFILE_MOOD}{' '}
                  <img src={img(`images/${PROFILE_MOOD_GIF}`)} alt="" className="moodEmoji" />
                </p>
                <p className="viewMy">
                  View My:{' '}
                  <a href="#pics">Pics</a> | <a href="#videos">Videos</a>
                </p>
              </div>
              <div className="profileInfo">
                <span className="tagline">{PROFILE_TAGLINE}</span>
                <p>Male</p>
                <p>32 years old</p>
                <p>{PROFILE_LOCATION}</p>
                <p>United States</p>
                {!USE_TOM_PRESET && <div className="onlineNow"><img src="/myspace/images/Online-Now.gif" alt="Online Now!" /></div>}
                <p style={{ marginBottom: '30px' }}>
                  Last Login: <span>{lastLogin}</span>
                </p>
              </div>
            </div>
            <div className="contact">
              <h3>
                Contacting{' '}<span className="userName">{PROFILE_NAME}</span>
              </h3>
              <div className="contactNav">
                <table className="contactTable" border="0" cellSpacing="0" cellPadding="0" width="300">
                  <tbody>
                    <tr><td className="contactRowSpacer contactTopSpacer" colSpan="3" /></tr>
                    <tr>
                      <td className="contactLeft" width="120"><a href="#msg"><img src={img('images/mail_1.gif')} alt="Send Message" /></a></td>
                      <td className="contactGap" width="15" />
                      <td className="contactRight" width="150"><a href="#forward"><img src={img('images/forward_1.gif')} alt="Forward to Friend" /></a></td>
                    </tr>
                    <tr><td className="contactRowSpacer" colSpan="3" /></tr>
                    <tr>
                      <td className="contactLeft" width="130"><a href="#add"><img src={img('images/friend_1.gif')} alt="Add to Friends" /></a></td>
                      <td className="contactGap" width="15" />
                      <td className="contactRight" width="150"><a href="#fav"><img src={img('images/favorite_1.gif')} alt="Add to Favorites" /></a></td>
                    </tr>
                    <tr><td className="contactRowSpacer" colSpan="3" /></tr>
                    <tr>
                      <td className="contactLeft" width="130"><a href="#im"><img src={img('images/im_1.gif')} alt="Instant Message" /></a></td>
                      <td className="contactGap" width="15" />
                      <td className="contactRight" width="150"><a href="#block"><img src={img('images/block_1.gif')} alt="Block User" /></a></td>
                    </tr>
                    <tr><td className="contactRowSpacer" colSpan="3" /></tr>
                    <tr>
                      <td className="contactLeft" width="130"><a href="#group"><img src={img('images/group_1.gif')} alt="Add to Group" /></a></td>
                      <td className="contactGap" width="15" />
                      <td className="contactRight" width="150"><a href="#rank"><img src={img('images/rank_1.gif')} alt="Rank User" /></a></td>
                    </tr>
                    <tr><td className="contactRowSpacer contactBottomSpacer" colSpan="3" /></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="userUrl">
              <div className="userUrlInner">
                <p><strong>MySpace URL:</strong></p>
                <p><a href="#" onClick={e => e.preventDefault()}>{MYSPACE_URL}</a></p>
              </div>
            </div>
            <MySpaceMusicPlayer />
            <div className="userInterests interestsAndDetails">
              <h3><span className="userName">{PROFILE_NAME}</span>'s Interests</h3>
              <div className="interestsInner">
                <table className="interestsTable">
                  <tbody>
                    {INTERESTS.map((item, i) => (
                      <tr key={i}>
                        <th className="interestLabel">{item.category}</th>
                        <td className="interestContent">{item.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="userDetails">
              <h3>
                <span className="userName">{PROFILE_NAME}</span>'s Details
              </h3>
              <table className="detailsTable">
                <tbody>
                  {DETAILS.map((item, i) => (
                    <tr key={i}>
                      <th>{item.label}</th>
                      <td>
                        {item.content ? (
                          item.content
                        ) : item.href ? (
                          <a href={item.href}>{item.value}</a>
                        ) : (
                          item.value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="userSchools">
              <h3>
                <span className="userName">{PROFILE_NAME}</span>'s Schools
              </h3>
              <div className="schoolsInner">
                {SCHOOLS.length > 0 ? (
                  <table className="schoolsTable">
                    <tbody>
                      {SCHOOLS.map((school, i) => (
                        <tr key={i}>
                          <td className="schoolInfo">
                            <a href="#school">{school.name}</a>
                            <br />
                            {school.location}
                            <br />
                            Graduated: <a href="#grad">{school.graduated}</a>
                            <br />
                            Student status: {school.status || 'Alumni'}
                            {school.major && <><br />Major: {school.major}</>}
                            {school.clubs && <><br />Clubs: {school.clubs}</>}
                          </td>
                          <td className="schoolYears">{school.yearsAttended}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="schoolEmpty">No schools added yet</p>
                )}
              </div>
            </div>
          </div>
          <div className="right">
            <div className="network extendedNetwork">
              <span className="blacktext12">{STATUS_MESSAGE}</span>
            </div>
            <div className="blog latestBlogEntry">
              <p style={{ fontWeight: 'bold' }}>
                <span className="userName">{PROFILE_NAME}</span>'s latest blog
                entry <span style={{ fontWeight: 'normal' }}>[</span><a href="#sub">Subscribe to this blog</a><span style={{ fontWeight: 'normal' }}>]</span>
              </p>
              {BLOG_ENTRIES.map((entry, i) => (
                <p key={i}>
                  <span className="text">{entry.title}</span>{' '}
                  (<a href={entry.href}>view more</a>)
                </p>
              ))}
              <p>
                [<a href="#all">View All Blog Entries</a>]
              </p>
            </div>
            <div className="blurb blurbs">
              <h3 className="blurbHeader">
                <span className="userName">{PROFILE_NAME}</span>'s Blurbs
              </h3>
              <h4 className="orangetext15">About me:</h4>
              <p className="blurbText">{BLURB_ABOUT}</p>
              <h4 className="orangetext15">Who I'd like to meet:</h4>
              <p className="blurbText">{BLURB_WHO}</p>
            </div>
            <div className="friends friendSpace">
              <h3 className="blurbHeader">
                <span className="userName">{PROFILE_NAME}</span>'s Friend Space (Top 8)
              </h3>
              <p className="friendCount">
                <span className="userName">{PROFILE_NAME}</span> has{' '}
                <span className="friendCountNumber">{FRIEND_COUNT.toLocaleString()}</span>{' '}
                friends.
              </p>
              <div className="top8">
                {FRIENDS.map(f => (
                  <div key={f.name}>
                    <a href="#friend">
                      <span className="top8-name">{f.name}</span>
                      <img src={img(`images/friends/${f.img}`)} alt={f.name} />
                    </a>
                  </div>
                ))}
              </div>
              <p className="viewAllFriends">
                <a href="#allfriends">View All of {PROFILE_NAME}'s Friends</a>
              </p>
            </div>
            <div className="friendsComments">
              <h3 className="blurbHeader">
                <span className="userName">{PROFILE_NAME}</span>'s Friends Comments
              </h3>
              <div className="friendsComments-inner">
                <p className="friendsComments-display">
                  <b>
                    Displaying <span className="redtext"> {comments.length} </span>of{' '}
                    <span className="redtext"> {comments.length} </span>comments (
                    <a href="#viewComments">View All</a> |{' '}
                    <a href="#addComment" onClick={e => { e.preventDefault(); setShowCommentForm(f => !f); }}>Add Comment</a>)
                  </b>
                </p>

                {/* Post a Comment form - toggled by Add Comment link */}
                {showCommentForm && <div className="comment-form">
                  <div className="comment-form-header">
                    Post A Comment About {PROFILE_NAME}
                  </div>
                  <form onSubmit={submitComment}>
                    <table className="comment-form-table" cellSpacing="0" cellPadding="4">
                      <tbody>
                        <tr>
                          <td className="comment-form-label">From:</td>
                          <td>
                            <input
                              type="text"
                              className="comment-name-input"
                              value={commentName}
                              onChange={e => setCommentName(e.target.value)}
                              placeholder="Your name"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="comment-form-label">Body:</td>
                          <td>
                            <div className="comment-toolbar">
                              <button type="button" title="Bold" onClick={() => wrapSelection('<b>', '</b>')}><b>B</b></button>
                              <button type="button" title="Italic" onClick={() => wrapSelection('<i>', '</i>')}><i>I</i></button>
                              <button type="button" title="Underline" onClick={() => wrapSelection('<u>', '</u>')}><u>U</u></button>
                              <button type="button" title="Strikethrough" onClick={() => wrapSelection('<s>', '</s>')}><s>S</s></button>
                            </div>
                            <textarea
                              ref={commentBodyRef}
                              className="comment-body-input"
                              value={commentBody}
                              onChange={e => setCommentBody(e.target.value)}
                              rows={4}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="comment-form-submit">
                      <button type="submit" className="comment-submit-btn">Post a Comment</button>
                    </div>
                  </form>
                </div>}

                <div className="friendsComments-list">
                  {comments.map((c, i) => (
                    <div key={i} className="comment-item">
                      <div className="comment-item-header">
                        <span className="comment-item-name">{c.name}</span>
                        <span className="comment-item-date">{c.date}</span>
                      </div>
                      <div className="comment-item-body" dangerouslySetInnerHTML={{ __html: c.body }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="myspace-footer">
          <div className="footer-links">
            <a href="#about">About</a> | <a href="#faq">FAQ</a> | <a href="#terms">Terms</a> | <a href="#privacy">Privacy Policy</a> | <a href="#safety">Safety Tips</a> | <a href="#contact">Contact MySpace</a> | <a href="#report">Report Abuse</a> | <a href="#advertise">Advertise</a> | <a href="#international">MySpace International</a> | <a href="#latino"><b>MySpace Latino</b></a>
          </div>
          <div className="footer-copyright">
            &copy;2003-2008 MySpace.com. All Rights Reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default MySpace;
