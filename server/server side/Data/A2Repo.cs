using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.AspNetCore.Mvc;
using A2.Models;
using Data;

namespace A2.Data
{
    public class A2Repo: IA2Repo
    {
        private readonly A2DBContext _dbContext;

        public A2Repo(A2DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void AddUser(User NewUser)
        {
            User u = new User { UserName = NewUser.UserName, Address = NewUser.Address, Password = NewUser.Password };
            _dbContext.Users.Add(u);
            _dbContext.SaveChanges();
        }
        public IEnumerable<User> GetAllUsers()
        {
            IEnumerable<User> AllUsers = _dbContext.Users.ToList<User>();
            return AllUsers;
        }//Done with EP1

        public bool ValidLogin(string userName, string password)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserName == userName && e.Password == password);
            if (user == null)
                return false;
            else
                return true;
        }

        public bool Is_User_Registered(string username)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserName == username);
            if (user == null)
                return false;
            else
                return true;
        }

        public IEnumerable<GameRecord> GetAllGameRecords()
        {
            IEnumerable<GameRecord> all_records = _dbContext.GameRecords.ToList<GameRecord>();
            return all_records;
        }

        public void AddGameRecord(GameRecord new_record)
        {
            //EntityEntry<GameRecord> ee = _dbContext.GameRecords.Add(new_record);
            //GameRecord new_added_record = ee.Entity;
            _dbContext.GameRecords.Add(new_record);
            _dbContext.SaveChanges();
        }

        public string RegisterAMove1(string gameid, string move)
        {
            GameRecord current_game_record = GetAllGameRecords().FirstOrDefault(e => e.GameId == gameid);

            if(current_game_record.LastMovePlayer1 == null && current_game_record.LastMovePlayer2 == null)
            {
                current_game_record.LastMovePlayer1 = move;
                _dbContext.SaveChanges();
                return "move registered";
            }else if(current_game_record.LastMovePlayer1 == null && current_game_record.LastMovePlayer2 != null){
                current_game_record.LastMovePlayer1 = move;
                current_game_record.LastMovePlayer2 = null;
                _dbContext.SaveChanges();
                return "move registered";
            }
            else
            {
                return "It is not your turn.";
            }
        }

        public string RegisterAMove2(string gameid, string move)
        {
            GameRecord current_game_record = GetAllGameRecords().FirstOrDefault(e => e.GameId == gameid);
            if (current_game_record.LastMovePlayer2 == null && current_game_record.LastMovePlayer1 == null)
            {
                current_game_record.LastMovePlayer2 = move;
                _dbContext.SaveChanges();
                return "move registered";
            }
            else if (current_game_record.LastMovePlayer2 == null && current_game_record.LastMovePlayer1 != null)
            {
                current_game_record.LastMovePlayer2 = move;
                current_game_record.LastMovePlayer1 = null;
                _dbContext.SaveChanges();
                return "move registered";
            }
            else
            {
                return "It is not your turn.";
            }
        }

        public string DeleteGameRecord(string gameid)
        {
            GameRecord current_involve_game_record = GetAllGameRecords().FirstOrDefault(e => e.GameId == gameid);
            EntityEntry<GameRecord> ee = _dbContext.GameRecords.Remove(current_involve_game_record);
            _dbContext.SaveChanges();
            return "game over";

        }

        public void PairUser(GameRecord current_waiting_game,string user2)
        {
            current_waiting_game.State = "progress";
            current_waiting_game.Player2 = user2;
            _dbContext.SaveChanges();
        }

        public bool UserHasGame(string username)
        {
            GameRecord user_start_game = GetAllGameRecords().FirstOrDefault(e => e.Player1 == username && e.State == "progress");
            if (user_start_game == null)
            {
                user_start_game = GetAllGameRecords().FirstOrDefault(e => e.Player2 == username && e.State == "progress");
                if(user_start_game == null)
                {
                    return false;
                }
            }
            return true;
            
        }
    }
}