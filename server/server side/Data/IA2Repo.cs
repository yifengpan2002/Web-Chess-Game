
using A2.Models;
using Microsoft.AspNetCore.Mvc;
using A2.Dtos;


namespace A2.Data
{
    public interface IA2Repo
    {
        public void AddUser(User user);
        public bool Is_User_Registered(string username);
        public IEnumerable<User> GetAllUsers();//done with endpoint 1

        public bool ValidLogin(string userName, string password);

        public IEnumerable<GameRecord> GetAllGameRecords();
        public void AddGameRecord(GameRecord new_record);

        public string RegisterAMove1(string gameid, string move);
        public string RegisterAMove2(string gameid, string move);

        public void PairUser(GameRecord current_waiting_game, string user2);

        public string DeleteGameRecord(string gameid);
        public bool UserHasGame(string username);
        
    }
}