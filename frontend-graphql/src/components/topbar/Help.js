import React from 'react'
import { Collapse, Breadcrumb, Button, Icon} from 'antd'
import '../css/App.css'

const icon = <Icon type="minus" />


class Help extends React.Component {

    render() { return(
        <Collapse bordered={false} style={{backgroundColor:'transparent'}}>
        <Collapse.Panel bordered={false} header="Getting Started" key='1' style={{border:0}} >
            <Collapse bordered={false} accordion={true} style={{display:'inline-block',  backgroundColor:'transparent', marginLeft:'20px'}}>
                <Collapse.Panel header={"About and Contact"}>
                    A project sheltered by the Northwestern University department of Political Science, CDP has the only geographic database of Chicago elections and demographic maps from 2004-Present.  Contact <a href="mailto:chicagodemocracyproject@gmail.com">ChicagoDemocracyProject@gmail.com</a> for more information.<br /><br /> 
                    Welcome to the Chicago Elections Database how-to. We are glad you are here to use the online tool we have developed for analyzing Chicago politics.<br /><br />
                    This is a web-based database that is useful in instantly displaying electoral results from the last decade of Chicago elections on a map of the city, so users can visualize and intuitively grasp how politics plays out across the city. The database is designed to be easy to use, and here are some instructions to guide you. Note that because it helps to simultaneously see all the controls and the map, the tool works better on big screens, so it might be a good idea to work on a laptop or tablet rather than your phone. The next paragraphs and bullet points can help you explore the database.<br /><br />
                </Collapse.Panel>
                <Collapse.Panel header={"Display One Race"}>
                    In the “Search race or candidate” box at the top left, begin by typing in the name of a candidate, office type, election type, or year of election. <br /><br />
                    {icon} The database will suggest keywords automatically as you type them. As you type, a list of suggestions should appear below the Search box. If the term you are looking for appears, click on it, or highlight it and press “Return.”<br />
                    {icon} If you are not quite sure what candidate or election you are looking for, you can click on “Search Tools” just below the search box for some common types of elections and offices. <br /><br />
                    A list of the elections that best fit your search will appear below the Search box. There are two ways to select race results within each race. <br /><br />
                    {icon} First, you can click on the blue-lettered name of the office/year. This will display a map showing which candidate came in first in each part of the city, with a different color representing each candidate that took part in the race. The key for these colors is in the lower right corner (Note that for some races, like ballot measures and judicial retention, the “candidates” may be “Yes” and “No.”<br />
                    {icon} Second, you can map a particular candidate’s results by area to see where they got a greater or lesser percent of the vote. Click on the small person-shaped icon where it says “Candidate Maps” to pull down a menu of all the candidates in the race. Choose the candidate whose results you’d like to see displayed. The percentages associated with the colors used to display areas of relative electoral strength and weakness are shown in a box at the lower right. These percentages will change for each candidate, so pay attention to the numbers there. [Note also that for some votes, like ballot measures or judges, “Yes” or “No” are the candidates.<br /><br />
                </Collapse.Panel>
                <Collapse.Panel header={"Map Tools"}>
                    When you choose a map, the results from that election will be projected on the map of Chicago. There are a few map options you can choose to understand and visualize the results.<br /><br />
                    {icon} In general, to move around the map, and zoom in, you can use the same kinds of controls you would use on any web-based or Google-style map.<br />
                    {icon} Just above the map, there is a pull-down menu that allows you to change between maps associated with the chosen race. “Aggregate” refers to the winner-by-area map, and the other options are for the candidates in the race.<br />
                    {icon} To the right of the pull-down menu are options to view the results at the Ward or Precinct level. There are 50 Wards, and just over 2000 Precincts, in the city. Usually the ward is the best way to see how the election played out across the city, but if you’re looking at a particular PART of the city, or within a particular ward, sometimes the precincts are more interesting.<br />
                    {icon} You can click on any area (Ward or Precinct, depending on how you mapped it) to see a quick list of how each candidate did in that area. A small bubble pops up to give vote totals and percentages by candidate in that area.<br />
                    {icon} In the top-left corner of the map, there is a small address search box. You can type in any address in Chicago and the map will take you to that area, and automatically give you the results from that area (again, Ward or Precinct depending on which option you’ve chosen). This is handy to learn what ward and precinct you are in, and to learn more about the very local results there (for city council, for example).<br />
                    {icon} Above the map, there is a description of which results you are currently viewing. Note that this description is also present in the URL for the map, so you can quickly copy and paste the URL itself to share the map with others or place a link to the database in text elsewhere.<br />
                    {icon} Just to the right of the map description are two buttons that allow you to view the results as a map (as we have been doing) or as a graph. Clicking on “Graph” will bring up a bar chart showing the overall results of the race you’re analyzing.<br /><br />
                </Collapse.Panel>
                <Collapse.Panel header={"Compare Two Races"}>
                    The outcomes of two races can be compared. Compare two election results by selecting one race as described above, selecting 'Compare Two Races' from the sidebar, then searching for and selecting another race. <br />
                    {icon}Note that races cannot be compared across ward and precinct redistricting in 2015.  The sidebar will automatically update the possible year range to reflect comparable races after the first race is chosen.<br /><br />
                    The database will generate a scatterplot comparing candidates.  Note that the names of the races compared will be displayed in the top bar.  There are two pull-down menus, each from which you can select one candidate from one race to compare. <br /><br />
                    You may also choose "Election" from the top bar, which will display a bar graph of the election results overall.  Choose "Candidates" to return to the scatterplot. <br /><br />
                </Collapse.Panel>
                <Collapse.Panel header={"View Neighborhood demography"}>
                    Search for demographic maps on the sidebar to see ward- and precinct-level demographic measures.
                </Collapse.Panel>

            </Collapse>
        </Collapse.Panel>
        </Collapse>
        )}
}

export default Help