/** @jsx React.DOM */

'use strict';

var React = require('react'),
    ProjectList = require('./ui/ProjectList'),
    ProjectItem = require('./ui/ProjectItem'),
    ProjectBrowser = require('./ui/ProjectBrowser'),
    featuredProjectsInfo = require("./featured_projects.json"),
    featuredProjectInfo = featuredProjectsInfo[0],
    lunr = require('lunr'),
    $ = require('jquery');

featuredProjectInfo.projects = [];

// from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
        results = regex.exec(location.hash);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var popularProjects,
    projects,
    recentProjects,
    featuredProjects,
    currentTag = null,
    allTags = [];

var projectBrowser;

var idx = lunr(function () {
    this.field('title', { boost: 10 });
    this.field('description', { boost: 5 });
    this.field('author_name');
});

function scoring(s1, s2) {
    return s1 * s2 / (s1 + s2);
}

function updateDisplay() {
    /* jshint trailing:false, quotmark:false, newcap:false */
    var searchTerm = getParameterByName('search');
    $('input').val(searchTerm);
    currentTag = null;
    if (!searchTerm) {
        currentTag = getParameterByName('tag');
    }
    var results = [];
    if (searchTerm) {
        projectBrowser = null;
        results = idx.search(searchTerm).sort(function(a, b) {
            return scoring(b.score, projects[b.ref].stars) - scoring(a.score, projects[a.ref].stars);
        }).map(function(result) {
            return projects[result.ref];
        });
        React.render(
            results.length ? <ProjectList projects={results} /> : <div className="alert alert-warning" role="alert">No results found.</div>,
            document.querySelector(".project-list-container")
        );
    } else {
        projectBrowser = React.render(
            <ProjectBrowser
                featuredProjectInfo={featuredProjectInfo}
                popularProjects={popularProjects}
                recentProjects={recentProjects}
                allTags={allTags}
                tag={currentTag}
            />,
            document.querySelector(".project-list-container")
        );
    }
}

var readyd = $.Deferred();

$(document).ready(function() {
    'use strict';
    readyd.resolve();

    $(window).on('scroll', function(){
        if (!projectBrowser) return;
        if( $(window).scrollTop() + 200 > $(document).height() - $(window).height() ) {
            projectBrowser.showMore();
        }
    }).scroll();
});

$.when($.get('/scripts/data.json'), readyd.promise()).done(function(res){
    var data = res[0];
    // popularProjects = data.popular_projects;
    // recentProjects = data.recent_projects;
    projects = data.projects;
    var featuredProjects = [];
    var urls = {};
    featuredProjectInfo.urls.forEach(function(u) {
        urls[u] = true;
    });
    projects.forEach(function(p, ind) {
        p.id = ind;
        p.last_commit_date = new Date(p.last_commit_date);
        p.author_name = p.author.name;
        idx.add(p);

        if (urls[p.repository.href]) {
            featuredProjects.push(p);
        }
    });
    featuredProjectInfo.projects = featuredProjects;

    allTags = Object.keys(data.tag_stats);
    allTags.sort(function(a, b) {
        return data.tag_stats[b] - data.tag_stats[a];
    });

    popularProjects = projects.slice(0);
    recentProjects = projects.slice(0);
    popularProjects.sort(function(a, b) {
        return b.stars - a.stars;
    });
    recentProjects.sort(function(a, b) {
        return b.last_commit_date - a.last_commit_date;
    });

    $('.search-bar input').on('input', function(evt) {
        var searchTerm = $('.search-bar input').val();
        location.hash = "search=" + searchTerm;
    });

    $(window).on('hashchange', updateDisplay);
    updateDisplay();
});
