﻿using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using In_Anh.Models;
using In_Anh.Models.MongoModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using static Google.Rpc.Context.AttributeContext.Types;

namespace In_Anh.Controllers
{
    public class AuthController : BaseController
    {
        public AuthController(IConfiguration config, IImageMgDatabase setting) : base(config, setting)
        {
        }


        // GET: AuthController
        public async Task<ActionResult> IndexAsync(string token)
        {
            FirebaseHelper.SetEnviromentVar();
            FirebaseToken decodedToken = await FirebaseAuth.GetAuth(FirebaseApp.GetInstance("jin-nie"))
    .VerifyIdTokenAsync(token);
            string uid = decodedToken.Uid;
            var user = await FirebaseAuth.GetAuth(FirebaseApp.GetInstance("jin-nie")).GetUserAsync(uid);
            var us = new UserModel()
            {
                UserName =string.IsNullOrEmpty(user.DisplayName) ? user.ProviderData[0].DisplayName : user.DisplayName,
                Email = string.IsNullOrEmpty(user.Email) ? (user.ProviderData[0].Email ?? user.Uid) : user.Email,
                PhoneNumber = string.IsNullOrEmpty(user.PhoneNumber) ? user.ProviderData[0].PhoneNumber : user.PhoneNumber ,
                ImageUrlUser = string.IsNullOrEmpty(user.PhotoUrl) ? user.ProviderData[0].PhotoUrl : user.PhotoUrl,
                Uid = uid,
                
            };

            SetCookies("userToken", GenerateJSONWebToken(us), 3600);
            await _usersCollection.InsertOneAsync(us);
            var  partialViewHtml = await this.RenderViewAsync("UserRender", us, true);
            return Content(partialViewHtml);
        }

        public ActionResult InitLogin()
        {
            var token = Request.Cookies["userToken"];


            var validuser = GetUserValid(token);
            if (string.IsNullOrEmpty(validuser?.Email))
            {
                RemoveCookies("userToken");
                
                return new JsonResult(new
                {
                    Code=400
                });
            }

            return new JsonResult(new
            {
                Code = 200,
                Data = JsonConvert.SerializeObject(validuser)
            });
        }
        // GET: AuthController/Details/5

        private string GenerateJSONWebToken(UserModel userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
        new Claim("email", userInfo.Email ?? "" ),
        new Claim("name", userInfo.UserName ?? ""),
        new Claim("website", userInfo.ImageUrlUser ?? "" ),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        

    }
}
