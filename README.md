
## Add your files

```
cd existing_repo
git remote add origin https://gitlab.smartleague.ro/mihaisc/site.git
git branch -M main
git push -uf origin main
```

## Test and Deploy
```
docker build . -t test
docker run -p 80:80 test
```
***
