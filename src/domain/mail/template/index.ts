export const verifyTemplate = (url: string, email: string) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>이메일 인증</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      width: 100%;
      padding: 20px;
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    h1 {
      color: #333333;
      font-size: 24px;
    }

    p {
      color: #666666;
      font-size: 16px;
      margin-bottom: 40px;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4caf50;
      color: white;
      text-decoration: none;
      font-size: 18px;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: #45a049;
    }

    .footer {
      margin-top: 50px;
      color: #999999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>소중한 댓글 감사합니다.</h1>
    <p>인증을 위해 아래의 확인 버튼을 눌러주세요.</p>
    <a href="${url}?email=${encodeURIComponent(email)}" class="button">인증</a>

    <div class="footer">
      <p>본 이메일은 자동으로 발송된 메일입니다. 문의사항은 010-4348-5571로 연락주세요.</p>
    </div>
  </div>
</body>
</html>
`;
