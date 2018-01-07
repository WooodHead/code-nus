import { h, Component } from 'preact';
import style from './style.scss';

export default class Card extends Component {
  shouldComponentUpdate() {
    return false;
  }

  // Disable for description html
  /* eslint-disable react/no-danger */
  render({
    nameWithOwner,
    url,
    descriptionHTML,
    primaryLanguage,
    homepageUrl,
    repositoryTopics,
    stargazers,
  }) {
    const [owner, name] = nameWithOwner.split('/');
    return (
      <div className={style.repo}>
        <div>
          <h3 className="h4">
            <a href={url}>
              <span className="font-weight-normal">{owner} / </span>
              {name}
            </a>
          </h3>
          <p
            dangerouslySetInnerHTML={{
              __html: descriptionHTML,
            }}
          />
        </div>
        {homepageUrl && <a href={homepageUrl}>{homepageUrl}</a>}
        <div className={style.info}>
          <span className={style.detail}>{primaryLanguage}</span>
          <span className={style.detail}>
            <span role="img" aria-label="star">
              ⭐
            </span>{' '}
            {stargazers}
          </span>
          {repositoryTopics.length > 0 && (
            <span className={style.topics}>
              {repositoryTopics.map((topic) => <span className={style.topic}>{topic}</span>)}
            </span>
          )}
        </div>
      </div>
    );
  }
}
