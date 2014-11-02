/** @jsx React.DOM */

'use strict';

var React = require('react');

var ProjectItem = React.createClass({
    render: function() {
        var project = this.props.project;
        var image = project.image;
        if (this.props.hideImage) {
            image = null;
        }
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <div className={"project" + (image ? "" : " no-image")}>
                <div className="text">
                    <header>
                        <div className="title">
                            {project.title}
                        </div>
                        <div className="author">
                            <a href={"#search=" + project.author.name}>{project.author.name}</a>
                        </div>
                    </header>
                    <div className="body">
                        <div className="description">
                            {project.description}
                        </div>
                    </div>
                    <div className="links">
                        <a href={project.repository.href}>Repository</a>
                        { project.release || project.homepage ?
                            <a href={(project.release && project.release.href) || project.homepage}>Link</a>
                            : []
                        }
                    </div>
                    <div className="stats">
                        <div className="stars">
                            <a href={project.repository.href}>{project.stars}</a>
                        </div>
                    </div>
                </div>
                <div className="image">
                    { image ?
                    <a href={project.repository.href}><img src={project.image} /></a> : []
                    }
                </div>
            </div>
        );
    }
});

module.exports = ProjectItem;
