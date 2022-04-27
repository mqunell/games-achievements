### [Games and Achievements](https://games.mattqunell.com/) on Vercel

---

### What is It?

Games and Achievements is an interactive site for viewing stats about the video games I play, including platforms, recent and total playtimes, achievement names, personal and global completion percentages, and more. Display options provide different ways of viewing, filtering, and sorting the data.

---

### Development Overview

This was an important project in my web development career. I upgraded from a barebones MERN stack to many new technologies, including Next.js and static page generation, TypeScript, Tailwind CSS, and Framer Motion. I also worked a lot with the [Steam API](https://developer.valvesoftware.com/wiki/Steam_Web_API 'Steam API') and designed a method of aggregating data across multiple endpoints and caching it in a JSON file, which is then used to build the home page and every individual game page without duplicating API calls.

---

### Tech Stack

**Frontend**: Next.js React

- Tailwind CSS
- Headless UI components
- Framer Motion page transitions and other animations

**Backend**: Next.js static generation

- Data is aggregated, formatted, and cached during the build process. No other server code is necessary or used

**Hosting**: Vercel

- Automatic deployment from GitHub

**Other**:

- Steam API
- TypeScript

---

### Interesting Challenges

#### Aggregating Steam and Xbox data

The **Steam** API is easy enough to use when considering individual endpoints, but using multiple to collect data revealed some inconsistencies and a lack of functionality overall:

- Games are referred to as "games" and "apps" interchangeably, both in GET requests and the returned data
- I could not retrieve the descriptions of achievements that are hidden by default, regardless of whether they are unlocked on my account
- Games' achievements cannot be queried directly; they must be queried as a _user's_ list of achievements for that game (which was a problem with Xbox data; see below)

In order to aggregate the data from Steam, I needed to use three different endpoints and format their returned data more consistently.

**Xbox**, surprisingly, does not have an available API for users' libraries and achievements whatsoever. I resorted to writing an on-demand helper script that retrieves information from Steam and some manual data entry to include Xbox games:

1. Find the Steam IDs for the Xbox games I wanted to track
2. Find players who owned those games and have public profiles
3. Query data similarly to my own profile, but omit user-specific data like completion statuses and times
4. Generate a JSON file and manually mark achievements as completed to match my Xbox data

At this point, Steam data is gathered and formatted completely automatically, and Xbox data is collected manually but structured the same way. Part of the static generation build process is combining these sources of data into one list.

#### Animations and Page Transitions

**Headless UI** components were part of this site's design from the beginning, and the Transition component was initially how I handled all of the animations. It was the logical thing to do; I was working with the same library and docs, and still using Tailwind CSS for styling.

This changed after I came across the idea of using **Framer Motion** for page transitions, which was not a feature I initially planned to have, but immediately wanted. The key to making page transitions work is Motion's AnimatePresence component, which manages a very interesting gap in the React component lifecycle I hadn't noticed before: unmounting. AnimatePresence is crucial for this design because it allows the current page to animate out before the next page loads and animates in. Once I understood that concept, implementing basic page transitions was surprisingly simple.

At this point I decided to **refactor** the Headless UI Transition animations into Motion components since they are slightly easier to write and maintain, despite not using Tailwind CSS.

---

### Results

Steam's API is messy and Xbox's is non-existent, but I have a streamlined and mostly automated way of tracking my video game stats now. I am considering expanding on the platform and providing people with a way of viewing their own stats in the same way, but it would likely be limited to Steam due to the very specific process of managing Xbox data.

I experimented with a new stack while working on this site and liked it so much that I created a [project template](https://github.com/mqunell/nextjs-template 'project template GitHub repository') based on it that includes Next.js, TypeScript, Tailwind CSS, code stubs, and more.

Deploying on Vercel was also far simpler than deploying my previous project, [Movies Library](https://github.com/mqunell/MoviesLibrary 'Movies Library'), on Heroku. I didn't need to create special config files, push to a separate repository, or deal with a server that constantly puts itself to sleep. I can't speak for deploying non-Next.js apps on Vercel, but in this case it was an exceptional process.
