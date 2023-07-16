using System;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using A2.Data;
using A2.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using A2.Dtos;

namespace A2.Controllers
{
    [Route("api")]
    [ApiController]

    public class A2Controller : Controller
    {
        private readonly IA2Repo _repository;
        public A2Controller(IA2Repo repository)
        {
            _repository = repository;
        }

        [HttpPost("Register")]//Endpoint 1
        public ActionResult<string> Register(User potential_user)
        {
            
            if (_repository.Is_User_Registered(potential_user.UserName))
                return Ok("Username not avalibale.");
            _repository.AddUser(potential_user);
            return Ok("User successfully registered.");
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("GetVersionA")]
        public ActionResult<string> GetVersionA()
        {
            return Ok("1.0.0 (auth)");
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("PurchaseItem{id}")]
        public ActionResult<Order> PurchaseItem(Int64 id)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("user");
            string username = c.Value;
            Order order = new Order { UserName = username, ProductId = id };
            return Ok(order);
        }// done with ep3 but haven check if it doesnot authenticate before call id

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("PairMe")]
        public ActionResult<GameRecordOut> PairMe()
        {
            //1st check if anyone is waiting in gamreRecord
            GameRecord current_waiting_game = _repository.GetAllGameRecords().FirstOrDefault(e => e.State == "wait");
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("user");
            string username = c.Value;

            if (current_waiting_game == null)
            {
                string gameid = Guid.NewGuid().ToString();// just want to make sure the this create a new unique ID right?
                GameRecord new_record = new GameRecord { GameId = gameid, State = "wait", Player1 = username, Player2 = null, LastMovePlayer1 = null, LastMovePlayer2 = null };

                _repository.AddGameRecord(new_record);

                GameRecordOut new_record_out = new GameRecordOut { GameId = new_record.GameId, State = new_record.State, Player1 = new_record.Player1, Player2 = new_record.Player2, LastMovePlayer1 = new_record.LastMovePlayer1, LastMovePlayer2 = new_record.LastMovePlayer2 };

                return Ok(new_record_out);
            }
            else// means we have a waiting game but we still need to check If I have already involve in the current game
            {
                if(current_waiting_game.Player1 != username)
                {
                    _repository.PairUser(current_waiting_game, username);
                    GameRecordOut new_record_out = new GameRecordOut// 
                    {
                        GameId = current_waiting_game.GameId,
                        State = current_waiting_game.State,
                        Player1 = current_waiting_game.Player1,
                        Player2 = current_waiting_game.Player2,
                        LastMovePlayer1 = current_waiting_game.LastMovePlayer1,
                        LastMovePlayer2 = current_waiting_game.LastMovePlayer2
                    };
                    return Ok(new_record_out);
                }
                else// this means the current waiting game is myself
                {
                    GameRecordOut current_record_out = new GameRecordOut { GameId = current_waiting_game.GameId, State = current_waiting_game.State, Player1 = current_waiting_game.Player1, Player2 = current_waiting_game.Player2, LastMovePlayer1 = current_waiting_game.LastMovePlayer1, LastMovePlayer2 = current_waiting_game.LastMovePlayer2 };

                    return Ok(current_record_out);
                }
                

            }
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("TheirMove{gameid}")]
        public ActionResult<string> TheirMove(string gameid)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("user");
            string username = c.Value;

            GameRecord current_game = _repository.GetAllGameRecords().FirstOrDefault(e => e.GameId == gameid);
            if (current_game == null)
            {
                return Ok("no such gameId");
            }
            else
            {
                if (current_game.Player1 != username && current_game.Player2 != username)
                    return Ok("not your game id");
                if (current_game.State == "wait")
                    return Ok("You do not have an opponent yet.");
                if (current_game.Player1 == username)// I am the player1
                {
                    if (current_game.LastMovePlayer2 == null)
                        return Ok("Your opponent has not moved yet.");
                    else
                    {
                        return Ok(current_game.LastMovePlayer2);
                    }
                }
                else
                {
                    if (current_game.LastMovePlayer1 == null)
                        return Ok("Your opponent has not moved yet.");
                    else
                    {
                        return Ok(current_game.LastMovePlayer1);
                    }
                }
            }
        }//done with ep5

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPost("MyMove")]
        public ActionResult<string> MyMove(GameMove input_obj)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("user");
            string username = c.Value;

            GameRecord current_game = _repository.GetAllGameRecords().FirstOrDefault(e => e.GameId == input_obj.GameID);
            if (current_game == null)
            {
                return Ok("no such game id");
            }
            else
            {   if(current_game.Player1 != username && current_game.Player2 != username )
                    return Ok("not your game id");
                if (current_game.State == "wait")
                    return Ok("You do not have an opponent yet.");
                else
                {
                    if (current_game.Player1 == username)// we are the player1;
                    {
                        string result = _repository.RegisterAMove1(input_obj.GameID, input_obj.Move);
                        return Ok(result);
                    }
                    else if (current_game.Player2 == username)
                    {
                        string result = _repository.RegisterAMove2(input_obj.GameID, input_obj.Move);
                        return Ok(result);
                    }
                    else
                    {
                        return Ok("not your game id");
                    }
                }

            }
        }// done with ep6


        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("QuitGame{gameid}")]
        public ActionResult<string> QuitGame(string gameid)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("user");
            string username = c.Value;

            GameRecord current_game = _repository.GetAllGameRecords().FirstOrDefault(e => e.GameId == gameid);
            if (current_game == null)
            {
                return Ok("no such gameId");
            }
            else
            {
                if (! _repository.UserHasGame(username))
                {
                    return "You have not started a game.";
                }

                if (current_game.Player1 == username || current_game.Player2 == username)// we are the player1;
                {
                    return Ok(_repository.DeleteGameRecord(gameid));

                }
                else
                {
                    return Ok("not your game id");
                }
            }
        }
    }
}