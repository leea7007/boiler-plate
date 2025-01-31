const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 100,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 100,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//비밀번호 바꾸기
userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    //다른거 할 때도 비밀번호 암호화가 되기 때문에 이거로 넘기기, 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword와 암호화된 비밀번호(this.password) 비교
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err); // 에러 발생 시 콜백에 에러 전달
    cb(null, isMatch); // 비교 결과(isMatch)를 콜백으로 전달
  });
};

userSchema.methods.generateToken = async function () {
  const user = this;

  // JWT 생성
  const token = jwt.sign({ _id: user._id.toHexString() }, "secret");
  user.token = token; // 토큰 저장
  await user.save(); // MongoDB에 저장

  console.log("Generated token:", token); // 생성된 토큰 확인
  return token;
};

// findByToken 메서드 정의
userSchema.statics.findByToken = function (token) {
  const user = this;

  return new Promise((resolve, reject) => {
    jwt.verify(token, "secret", async function (err, decoded) {
      if (err) {
        return reject(err); // JWT 검증 오류가 있을 경우 reject
      }

      console.log("Decoded token:", decoded); // 디코딩된 토큰 확인

      try {
        // decoded._id를 ObjectId로 변환 (new 키워드를 사용)
        const userData = await user.findOne({
          _id: new mongoose.Types.ObjectId(decoded._id), // 수정된 부분
          token: token,
        });
        console.log("Query result:", userData); // 검색 결과 로그

        console.log(userData);
        console.log("Decoded token:", decoded);
        console.log("Token from request:", token);

        if (userData) {
          resolve(userData); // 사용자가 발견되면 반환
        } else {
          resolve(null); // 사용자가 없으면 null 반환
        }
      } catch (err) {
        reject(err); // 사용자 찾기 쿼리 오류 처리
      }
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User }; // 꼭 이렇게 내보내주세요
