# 파일 돌려보려면

bashgit clone https://github.com/유저명/저장소명.git


clone 후 프로젝트 폴더로 이동해서 의존성 설치:
bashcd 저장소명
npm install
npm run dev
node_modules는 .gitignore에 포함되어 있어서 clone 받으면 없음. 그래서 npm install로 package.json 기반으로 다시 설치해야 함.
