import json, yaml, os, base64, pathlib, datetime, feedparser, markdown, requests, urllib.request as ur

cfg = yaml.safe_load(open('portfolio.config.yml'))
owner = cfg['owner']
token = os.environ['GH_TOKEN']
head  = {'Authorization': f'token {token}',
         'Accept': 'application/vnd.github.v3+json'}

data_dir = pathlib.Path('public/data'); data_dir.mkdir(parents=True, exist_ok=True)

# ---------- user.json ----------
user = json.loads(ur.urlopen(ur.Request(f'https://api.github.com/users/{owner}', headers=head)).read())
(data_dir/'user.json').write_text(json.dumps({
    'name': user['name'] or owner,
    'bio':  user['bio'],
    'location': user['location'],
    'avatar': user['avatar_url'],
    'blog': user['blog'],
    'twitter': user['twitter_username'],
    'followers': user['followers']
}, ensure_ascii=False))

# ---------- repos.json ----------
featured = []
for full in cfg['featured_repos']:
    repo_api = f'https://api.github.com/repos/{full}'
    r = json.loads(ur.urlopen(ur.Request(repo_api, headers=head)).read())
    rd = json.loads(ur.urlopen(ur.Request(repo_api + '/readme', headers=head)).read())
    html = markdown.markdown(base64.b64decode(rd['content']).decode(), extensions=['fenced_code','tables'])
    featured.append({
        'full_name': full,
        'description': r['description'],
        'stars': r['stargazers_count'],
        'lang': r['language'],
        'html': html
    })
(data_dir/'repos.json').write_text(json.dumps(featured, ensure_ascii=False))

# ---------- extra yaml direct copy ----------
for k in ['services','timeline','testimonials','achievements']:
    if k in cfg:
        (data_dir/f'{k}.json').write_text(json.dumps(cfg[k], ensure_ascii=False))

print('Data build complete:', list(data_dir.iterdir()))
