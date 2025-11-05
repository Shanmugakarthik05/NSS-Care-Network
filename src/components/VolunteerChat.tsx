import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Send, Users, Circle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface Message {
  id: string;
  sender: string;
  senderId: string;
  message: string;
  timestamp: Date;
  isSelf?: boolean;
}

interface VolunteerChatProps {
  currentVolunteer: {
    id: string;
    name: string;
    college: string;
  };
}

export function VolunteerChat({ currentVolunteer }: VolunteerChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineVolunteers, setOnlineVolunteers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  // Load initial messages and online volunteers
  useEffect(() => {
    loadInitialData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly add a message from another volunteer
      if (Math.random() > 0.8) {
        addSimulatedMessage();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadInitialData = () => {
    // Simulate online volunteers
    const volunteers = [
      { id: "1", name: "Priya Sharma", college: currentVolunteer.college, status: "online" },
      { id: "2", name: "Rahul Verma", college: currentVolunteer.college, status: "online" },
      { id: "3", name: "Anita Kumar", college: currentVolunteer.college, status: "away" },
      { id: "4", name: "Vikram Singh", college: currentVolunteer.college, status: "online" },
      { id: "5", name: "Sneha Patel", college: currentVolunteer.college, status: "online" },
    ];
    setOnlineVolunteers(volunteers);

    // Simulate initial messages
    const initialMessages: Message[] = [
      {
        id: "1",
        sender: "Priya Sharma",
        senderId: "1",
        message: "Hi everyone! Ready for tomorrow's blood donation camp?",
        timestamp: new Date(Date.now() - 3600000),
        isSelf: false,
      },
      {
        id: "2",
        sender: "Rahul Verma",
        senderId: "2",
        message: "Yes! I've confirmed with 5 donors from our college.",
        timestamp: new Date(Date.now() - 3500000),
        isSelf: false,
      },
      {
        id: "3",
        sender: "Vikram Singh",
        senderId: "4",
        message: "Great work! I'm arranging refreshments for the volunteers.",
        timestamp: new Date(Date.now() - 3400000),
        isSelf: false,
      },
    ];
    setMessages(initialMessages);
  };

  const addSimulatedMessage = () => {
    const randomVolunteer = onlineVolunteers[Math.floor(Math.random() * onlineVolunteers.length)];
    const sampleMessages = [
      "Does anyone need help with the registration desk?",
      "I can bring some extra supplies tomorrow.",
      "The health camp was a great success today!",
      "We need more volunteers for next week's event.",
      "Thanks everyone for your hard work!",
    ];

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: randomVolunteer.name,
      senderId: randomVolunteer.id,
      message: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      timestamp: new Date(),
      isSelf: false,
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const message: Message = {
      id: Date.now().toString(),
      sender: currentVolunteer.name,
      senderId: currentVolunteer.id,
      message: newMessage.trim(),
      timestamp: new Date(),
      isSelf: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent!");
    }, 500);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Area */}
      <Card className="lg:col-span-2 flex flex-col h-[600px]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Volunteer Group Chat</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{currentVolunteer.college}</p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Circle className="w-2 h-2 mr-1 fill-current" />
              {onlineVolunteers.filter((v) => v.status === "online").length} Online
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div>
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 mb-4 ${msg.isSelf ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className={`w-8 h-8 ${msg.isSelf ? "bg-[#0077B6]" : "bg-gray-300"}`}>
                      <AvatarFallback className={msg.isSelf ? "text-white" : ""}>
                        {getInitials(msg.sender)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 max-w-[70%] ${msg.isSelf ? "items-end" : ""}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`text-sm ${msg.isSelf ? "text-right" : ""}`}>
                          {msg.isSelf ? "You" : msg.sender}
                        </span>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          msg.isSelf
                            ? "bg-[#0077B6] text-white rounded-tr-none"
                            : "bg-gray-100 text-gray-900 rounded-tl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {/* Invisible element for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="bg-[#0077B6] hover:bg-[#005f8f]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Online Volunteers Sidebar */}
      <Card className="h-[600px]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Online Volunteers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[520px]">
            <div className="p-4 space-y-3">
              {onlineVolunteers.map((volunteer) => (
                <motion.div
                  key={volunteer.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10 bg-gray-300">
                      <AvatarFallback>{getInitials(volunteer.name)}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        volunteer.status === "online" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{volunteer.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{volunteer.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
