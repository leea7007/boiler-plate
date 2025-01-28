const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const jwt = require("jsonwebtoken");

//application/x-ww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

//cookie-parser
app.use(cookieParser());

//leea7007 1029384756bB!
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://gPro:1029@project0.gvq59.mongodb.net/?retryWrites=true&w=majority&appName=project0",
    {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("진짜 안되는데 안되는데 123?");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/api/users/register", async (req, res) => {
  //회원가입시 필요 정보를 client에서 가져오면
  //데이터베이스에 삽입한다

  //body parser를 통해 body에 담긴 정보를 가져온다
  const user = new User(req.body);

  //mongoDB 메서드, user모델에 저장
  //여기서 암호화 함
  const result = await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

/* 콜백 이슈로 findOne이 변경
app.post("/login", (req, res) => {
  // 데이터베이스에서 요청된 이메일 찾기 find email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        massage: "해당 유저 없음",
      });
    }
    // 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, massage: "비밀번호 체크 필요" });
      //토큰 설정 jsonwebtoken lib
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 어딘가에 저장, 쿠키에나 로컬스토리지에 저장 가능
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});
*/
/*
app.post("/login", (req, res) => {
  // 데이터베이스에서 요청된 이메일 찾기 find email

  const user = User.findOne({ name: req.body.name });
  try {
    if (!user) {
      return res.json({
        loginSuccess: false,
        massage: "해당 유저 없음",
      });
    }
    console.log(req.body.password);

    // 비밀번호가 맞는지 확인
    user.comparePasswordPriv(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, massage: "비밀번호 체크 필요" });
      //토큰 설정 jsonwebtoken lib
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 어딘가에 저장, 쿠키에나 로컬스토리지에 저장 가능
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  } catch (err) {
    return console.log(err);
  }
});
*/
app.post("/api/users/login", async (req, res) => {
  try {
    // 유저를 데이터베이스에서 찾기
    const user = await User.findOne({ name: req.body.name });

    // 유저가 없을 경우
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 비밀번호 비교
    user.comparePassword(req.body.password, async (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error comparing password", error: err });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // 비밀번호가 맞으면 토큰 생성
      try {
        const token = await user.generateToken();

        // 응답이 두 번 보내지 않도록 체크
        if (!res.headersSent) {
          res.cookie("x_auth", token).status(200).json({
            loginSuccess: true,
            userId: user._id,
          });
        }
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Token generation failed", error: err });
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
});

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    name: req.user.name,
    isAuth: true,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, async (req, res) => {
  try {
    const userUpdate = await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: "" }
    );

    if (userUpdate) {
      return res.status(200).send({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User update failed" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, err });
  }
});
